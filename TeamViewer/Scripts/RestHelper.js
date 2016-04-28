// Provides Basic reusable functionality for using REST Queries

// Create a cache object to store the results of the query
window.restObjectCache = {}
// Cache = {[SearchType] : {[uniqueid] : [DataObject]}

// Use the Search function to query the people service and store in the cache object
//Options = { 
//    queryProperty: [Search Property] , 
//    queryValue: [Search Value]
//    }
function restPeopleSearchQuery(options) {
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
            success: onRestPeopleSearchSucceeded,
            error: onRestPeopleSearchFailed
        }
        );
}

function onRestPeopleSearchSucceeded(data) {
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
        // Create SearchPeopleCache object in the restObjectCache if it doesnt already exist and store the person Object
        if (!(restObjectCache.hasOwnProperty('searchPeopleResults'))) {
            restObjectCache['searchPeopleResults'] = {};
        }
        if (!(restObjectCache.searchPeopleResults[person.UserProfile_GUID])) {
            restObjectCache.searchPeopleResults[person.UserProfile_GUID] = person;
        }
    }
}

function onRestPeopleSearchFailed(err) {
    // return error to Console or log error to App
    console.log(err);
}

// Use the Search function to query the people service and store in the cache object
//Options = { 
//    AccountName: [User Account Name]
//    }
function restUserProfileAccountQuery(options) {
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

function onGetSingleUserDataSucceeded(data) {
    var jsonObject = JSON.parse(data.body);
    var user = jsonObject.d;
    // get the existing person from the restObjectCache or create a new person
    if (restObjectCache.searchPeopleResults[uniquePerson.UserProfile_GUID]) {
        var person = restObjectCache.searchPeopleResults[uniquePerson.UserProfile_GUID];
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
    // store person back into restObjectCache
    // TODO create add to restObjectCache option so the below does not need to be repeated
    if (!(restObjectCache.hasOwnProperty('searchPeopleResults'))) {
        restObjectCache['searchPeopleResults'] = {};
    }
    if (!(restObjectCache.searchPeopleResults[person.UserProfile_GUID])) {
        restObjectCache.searchPeopleResults[person.UserProfile_GUID] = person;
    }
}

function onGetSingleUserDataFailed(err) {
    console.log(err);
}

    // Allows pulling variables from query string paramters
function getQueryStringParameter(urlParameterKey) {
    var params = document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split('=');
        if (singleParam[0] == urlParameterKey)
            return decodeURIComponent(singleParam[1]);
    }
}