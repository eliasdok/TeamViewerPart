// RestHelper Module for SharePoint Online

// self calling function to create module
var restHelper = (function () {
    ////Public
    // Create a cache object to store the results of the query
    // Cache = {<SearchType> : {<uniqueid> : <DataObject>}
    // .searchPeopleResults
    var objectCache = {}

    var peopleSearchQuery = function (options) {
        return _restPeopleSearchQuery(options);
    }

    var userProfileAccountQuery = function (options) {
        return _restUserProfileAccountQuery(options);
    }

    var getFolders = function (options) {
        return _restGetFolder(options)
    }

    var createList = function (options) {
        return _restCreateList(options)
    }

    var getLists = function (options) {
        return _restGetLists(options)
    }

    /////////////////////////////////// Use the Search function to query the people service and store in the cache object
    //Options = { queryProperty: <Search Property>, queryValue: <Search Value> }
    var _restPeopleSearchQuery = function (options) {
        var searchUrl = "/_api/search/query?querytext='" + options.queryProperty + ":" + options.queryValue + "'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'";
        var appWebUrl = GetUrlKeyValue("SPAppWebUrl");
        var fullUrl = appWebUrl + searchUrl;
        return jQuery.ajax(
            {
                url: fullUrl,
                type: "GET",
                headers: {
                    "accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose"
                },
                success: _onRestPeopleSearchSucceeded,
                error: _onRestPeopleSearchFailed
            }
            );
    }

    var _onRestPeopleSearchSucceeded = function (data) {
        // fill cache object with people objects
        var data = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
        for (var i = 0; i < data.length; i++) {
            var results = data[i].Cells.results;
            // Create SearchPeopleCache object in the objectCache if it doesnt already exist and store the person Object
            if ((objectCache.hasOwnProperty('searchPeopleResults'))) {
                // get the existing person from the objectCache or create a new person
                if (objectCache.searchPeopleResults[(results[20].Value)]) {
                    var person = objectCache.searchPeopleResults[(results[20].Value)];
                } else {
                    var person = {};
                }
            } else {
                objectCache['searchPeopleResults'] = {};
                var person = {};
            }
            // Loop through all returned data and create key value pair object for each
            // TODO, check if array or object, map will not work for objects of objects
            results.map(function (r) {
                  // ChangeCase js Package to change the capitalisation on the first letter (the Key in this data is capitalised) 
                person[r.Key] = r.Value
            });
            // check if person already exists in object cache
            if (!(objectCache.searchPeopleResults[person.UserProfile_GUID])) {
                objectCache.searchPeopleResults[person.UserProfile_GUID] = person;
            }
        }
    }

    var _onRestPeopleSearchFailed = function (err) {
        // return error to Console or log error to App
        console.log(err);
    }

    /////////////////////////////////// Use the Search function to query the people service and store in the cache object
    //Options = { AccountName: <User Account Name>, userGUID: <user GUID> }
    var _restUserProfileAccountQuery = function (options) {
        // Cross Domain Request
        var executor = new SP.RequestExecutor(appWebUrl)
        // Build REST Query Url
        var profileGetUrl = "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + encodeURIComponent(options.accountName) + "'"
        var fullUrl = appWebUrl + profileGetUrl;
        return executor.executeAsync(
            {
                url: fullUrl,
                userGUID: options.userGUID,
                type: "GET",
                headers: {
                    "accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose"
                },
                success: _onUserProfileAccountQuerySucceeded,
                error: _onUserProfileAccountQueryFailed
            }
        );
    }

    var _onUserProfileAccountQuerySucceeded = function (data) {
        var jsonObject = JSON.parse(data.body);
        var user = jsonObject.d;
        // get the existing person from the objectCache or create a new person
        if (objectCache.searchPeopleResults[this.userGUID]) {
            var person = objectCache.searchPeopleResults[this.userGUID];
        } else {
            var person = {};
        }
        var results = user.UserProfileProperties.results
        // Assign all properties to exisitng or new object
        results.map(function (r) {
            person[r.Key] = r.Value;
        });
        // store person back into objectCache
        if (!(objectCache.hasOwnProperty('searchPeopleResults'))) {
            objectCache['searchPeopleResults'] = {};
        }
        if (!(objectCache.searchPeopleResults[person.UserProfile_GUID])) {
            objectCache.searchPeopleResults[person.UserProfile_GUID] = person;
        }
    }

    var _onUserProfileAccountQueryFailed = function (err) {
        console.log(err);
    }

    /////////////////////////////////// Use the List query to get a lists and libraries of web lists and store in restObjectCache
    //Options = { property: <Property>, target: <Site Url>
    //    }
    function _restGetLists(options) {
        // The browser will treat this request as cross domain so the appWebUrl must first be passed to the RequestExecutor
        // ensure to call this function as below
        // $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
        //        getSingleUserData();
        //    });
        var executor = new SP.RequestExecutor(appWebUrl)
        // Build REST Query Url
        var url = appWebUrl + "/_api/SP.AppContextSite(@target)/web/" + options.property + "?@target='" + options.target + "'";
        executor.executeAsync(
            {
                url: url,
                method: "GET",
                headers: {
                    "accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose"
                },
                success: onrestGetListsSucceeded,
                error: onrestGetListsFailed
            }
        );
    }

    function _onrestGetListsSucceeded(data) {
        var jsonObject = JSON.parse(data.body);
        var results = jsonObject.d.results;
        if (!(restObjectCache.hasOwnProperty('getListResults'))) {
            restObjectCache['getListResults'] = {};
        }
        results.map(function (list) {
            // store person back into restObjectCache
            // TODO create add to restObjectCache option so the below does not need to be repeated
            if (!(restObjectCache.getListResults[list.Id])) {
                restObjectCache.getListResults[list.Id] = list;
            }
        });
    }

    function _onrestGetListsFailed(err) {
        console.log(err);
    }

    /////////////////////////////////// Use the List query to get a lists and libraries of web lists and store in restObjectCache
    //Options = { listObject: <list object>, target: <Site Url> }
    // listObject 
    //  Create Object with default properties(Library)
    //    '__metadata': { 'type': 'SP.List' }, 
    //    'AllowContentTypes': <true>,
    //    'BaseTemplate': <101 Library><100 List>, 
    //    'ContentTypesEnabled': <false>, 
    //    'Description': <Description for List>, 
    //    'Title': <Title>
    function _restCreateList(options) {
        // Cross Domain Request
        var executor = new SP.RequestExecutor(appWebUrl)
        // Build REST Query Url
        var url = appWebUrl + "/_api/SP.AppContextSite(@target)/web/Lists?@target='" + options.target + "'";
        executor.executeAsync(
            {
                url: url,
                method: "POST",
                body: JSON.stringify(options.listObject),
                headers: {
                    "accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    // this may not be required when using the cross domain library
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: onrestCreateListSucceeded,
                error: onrestCreateListFailed
            }
        );
    }

    function _onrestCreateListSucceeded(data) {
        $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
            options = {
                property: "Lists",
                target: hostUrl
            };
            restGetLists(options);
        });
    }

    function _onrestCreateListFailed(err) {
        console.log(err);
    }


    /////////////////////////////////// Use the Folder Query to get folders in a library
    //Options = { 
    //    folderObject: <folder object>
    //    target: <Site Url>
    //    }
    // folderObject 
    //  Create Object with default properties(Library)
    //    '__metadata': { 'type': 'SP.Folder' },
    //    'Folder Title?

    function _restGetFolder(options) {
        // Cross Domain Request
        var executor = new SP.RequestExecutor(appWebUrl)
        // Build REST Query Url
        var url = appWebUrl + "/_api/SP.AppContextSite(@target)/web/Lists?@target='" + options.target + "'";
        executor.executeAsync(
            {
                url: "<app web url>/_api/SP.AppContextSite(@target)/web/getfolderbyserverrelativeurl('/Shared Documents/Folder A')?@target='<host web url>'",
                method: "POST",
                body: "{ '__metadata':{ 'type': 'SP.Folder' }, 'WelcomePage':'Folder B/WelcomePage.aspx' }",
                headers: {
                    "content-type": "application/json; odata=verbose",
                    "X-HTTP-Method": "MERGE"
                },
                success: onrestGetFolderSucceeded,
                error: onrestGetFolderFailed
            });
    }

    function _onrestGetFolderSucceeded(data) {

    }

    function _onrestGetFolderFailed(err) {
        console.log(err);
    }

    return {
        objectCache: objectCache,
        peopleSearchQuery: peopleSearchQuery,
        userProfileAccountQuery: userProfileAccountQuery,
        getFolders: getFolders,
        createList: createList,
        getLists: getLists
    };

})();