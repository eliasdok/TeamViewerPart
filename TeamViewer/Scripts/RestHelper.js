// RestHelper Module for SharePoint Online

// self calling function to create module
var restHelper = (function () {
    ////Public
    // Create a cache object to store the results of the query
    // Cache = {[SearchType] : {[uniqueid] : [DataObject]}
    // .searchPeopleResults
    var objectCache = {}

    var peopleSearchQuery = function (options) {
        _restPeopleSearchQuery(options);
    }

    var userProfileAccountQuery = function (options) {
        _restUserProfileAccountQuery(options);
    }

    var getQueryStringParameter = function (urlParameterKey) {
        return _getQueryStringParameter(urlParameterKey);
    }

    //// Private
    // Use the Search function to query the people service and store in the cache object
    //Options = { 
    //    queryProperty: [Search Property] , 
    //    queryValue: [Search Value]
    //    }
    var _restPeopleSearchQuery = function (options) {
        var searchUrl = "/_api/search/query?querytext='" + options.queryProperty + ":" + options.queryValue + "'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'";
        var appWebUrl = getQueryStringParameter("SPAppWebUrl");
        var fullUrl = appWebUrl + searchUrl;
        jQuery.ajax(
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
            // Create an object for each person and store it in the global store
            var person = {};
            // Loop through all returned data and create key value pair object for each
            // TODO, check if array or object, map will not work for objects of objects
            results.map(function (p) {
                var newPropertyName = p.Key
                // ChangeCase js Package to change the capitalisation on the first letter (the Key in this data is capitalised) 
                person[newPropertyName] = p.Value
            });
            // Create SearchPeopleCache object in the ObjectCache if it doesnt already exist and store the person Object
            if (!(objectCache.hasOwnProperty('searchPeopleResults'))) {
                objectCache['searchPeopleResults'] = {};
            }
            if (!(objectCache.searchPeopleResults[person.UserProfile_GUID])) {
                objectCache.searchPeopleResults[person.UserProfile_GUID] = person;
            }
        }
    }

    var _onRestPeopleSearchFailed = function (err) {
        // return error to Console or log error to App
        console.log(err);
    }

    // Use the Search function to query the people service and store in the cache object
    //Options = { AccountName: [User Account Name] }
    var _restUserProfileAccountQuery = function (options) {
        // The browser will treat this request as cross domain so the appWebUrl must first be passed to the RequestExecutor
        // ensure to call this function as below
        // $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
        //        getSingleUserData();
        //    });
        var executor = new SP.RequestExecutor(appWebUrl)
        // Build REST Query Url
        var profileGetUrl = "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + options.accountName + "'"
        var fullUrl = appWebUrl + profileGetUrl;
        executor.executeAsync(
            {
                url: fullUrl,
                type: "GET",
                headers: {
                    "accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose"
                },
                success: onGetSingleUserDataSucceeded,
                error: onGetSingleUserDataFailed
            }
        );
    }

    var _onGetSingleUserDataSucceeded = function (data) {
        var jsonObject = JSON.parse(data.body);
        var user = jsonObject.d;
        // get the existing person from the objectCache or create a new person
        if (objectCache.searchPeopleResults[uniquePerson.UserProfile_GUID]) {
            var person = objectCache.searchPeopleResults[uniquePerson.UserProfile_GUID];
        } else {
            var person = {};
        }
        /*
        // go get underscore.js to use this syntax
        _.map(user.UserProfileProperties.results, function (r) {
            person[r.Key] = r.Value;
        });
        */
        var results = user.UserProfileProperties.results
        // Loop trough all properties and assign to the person object
        results.map(function (p) {
            var newPropertyName = p.Key
            person[newPropertyName] = p.Value;
        });
        // store person back into objectCache
        // TODO create add to objectCache option so the below does not need to be repeated
        if (!(objectCache.hasOwnProperty('searchPeopleResults'))) {
            objectCache['searchPeopleResults'] = {};
        }
        if (!(objectCache.searchPeopleResults[person.UserProfile_GUID])) {
            objectCache.searchPeopleResults[person.UserProfile_GUID] = person;
        }
    }

    var _onGetSingleUserDataFailed = function (err) {
        console.log(err);
    }

    // Allows pulling variables from query string paramters
    var _getQueryStringParameter = function (urlParameterKey) {
        var params = document.URL.split('?')[1].split('&');
        var strParams = '';
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split('=');
            if (singleParam[0] == urlParameterKey)
                return decodeURIComponent(singleParam[1]);
        }
    }

    return {
        objectCache: objectCache,
        peopleSearchQuery: peopleSearchQuery,
        userProfileAccountQuery: userProfileAccountQuery,
        getQueryStringParameter: getQueryStringParameter,
        querySate: queryState
    };

})();