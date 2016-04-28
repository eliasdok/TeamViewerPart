// Provides Basic reusable functionality for using REST Queries

// Create a cache object to store the results of the query
var restObjectCache = {}
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

function onRestPeopleSearchSucceed(data) {
    // fill cache object with people objects
    var data = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
    for (var i = 0; i < data.length; i++) {
        var results = data[i].Cells.results;
        // Create an object for each person and store it in the global store
        var person = {};
        // Loop through all returned data and create key value pair object for each
        for (p in results) {
            var newPropertyName = p.Key
            person[newPropertyName] = p.Value
        }
        // Create SearchPeopleCache and Store Object
        if (!(restObjectCache.hasOwnProperty(SearchPeopleResults))) {
            restObjectCache[searchPeopleResults] = {};
        }
        if (!(restObjectCache.searchPeopleResults[person.UserProfile_GUID])) {
            restObjectCache.searchPeopleResults[person.UserProfile_GUID] = person;
        }
}

function onRestPeopleSearchFailed(err) {
    // return error to Console or log error to App
    console.log(err);
}

function getSingleUserData() {
    var executor = new SP.RequestExecutor(appWebUrl)
    // Build REST Query Url
    var profileGetUrl = "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + uniquePerson.AccountName + "'"
    var fullUrl = appWebUrl + profileGetUrl;
    // REST Call
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
    var user = jsonObject.d
    var person = profilesSearchArray[uniquePerson.UserProfile_GUID];
    /*
    // go get underscore.js to use this syntax
    _.map(user.UserProfileProperties.results, function (r) {
        person[r.Key] = r.Value;
    });
    */
    for (var i = 0; i < user.UserProfileProperties.results.length; i++) {
        var newPropertyName = user.UserProfileProperties.results[i].Key
        person[newPropertyName] = user.UserProfileProperties.results[i].Value;
    }
    // Switch out url for MThumb(medium thumbnail) for LThumb(Large thumbnail) or insert placeholder if NULL
    if (!person.PictureURL) {
        var pictureUrl = "/_layouts/15/images/PersonPlaceholder.200x150x32.png"
    } else {
        var pictureUrl = (person.PictureURL.substring(0, (person.PictureURL.length) - 10)) + "LThumb.jpg"
    }
    $("#userPictureLarge").html("<img height='200px' src='" + pictureUrl + "'></img>");
    $("#userNameLarge").html("<p>" + person.PreferredName + "</p>");
    $("#userTitleLarge").html("<p>" + person.JobTitle + "</p>");
    $("#userDepartmentLarge").html("<p>" + person.Department + "</p>");
    $("#userTelephoneLarge").html("<p>" + person.WorkPhone + "</p>");
}

function onGetSingleUserDataFailed(data) {

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