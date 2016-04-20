// Initiate Promise library

var Promise = require("bluebird");
// Configure
Promise.config({
    longStackTraces: true,
    warnings: true
})


Dragon = (function () {


    // Cache Object Variable with Key
    var cacheObject = {};

   
    restPeopleSearch(options, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result;
        }
    });

    restPeopleSearch(options)
        .then(function (storageArray) {
            return 5;
        })
        .then()
        .then().catch(function (err) {
        // something went wrong
    }).finally(function () {
        // after all is said and done
    });

    // Provides Basic reusable functionality for using REST Queries
    //function restPeopleSearch(appWebUrl, queryProperty, queryValue, storageArray) {
    // options = { adsf, asdf, asdf }
    function restPeopleSearch(options, cb) {

        //cacheObject[options] = result;
        //if (cacheObject?[appUrl]?[queryproperty]?[queryvalue]) {
        //    return cacheObject[appUrl][queryproperty][queryvalue];
        //}

        // Use the Search function to query the people service and return a collection of people with values, a storage Array variable should be passed to return the results
        function restPeopleSearchQuery() {
            var searchUrl = "/_api/search/query?querytext='" + queryProperty + ":" + queryValue + "'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'";
            // var appWebUrl = getQueryStringParameter("SPAppWebUrl");
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
            // fill array with people objects
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
                // Set hash table to user profile guid for easy caching and searching later
                storageArray[person.UserProfile_GUID] = person;
                
            }
            resolve(storageArray);
        }

        function onRestPeopleSearchFailed() {
            // return error to Console or log error to App
        }

        restPeopleSearchQuery
        console.log("PeopleSearchCompleted");

    }

    // Use Profiles service to get more data about a person, this requires the RequestExector function to allow cross domain queries in SharePoint
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

    return {
        xyz: xyz,
        abc: getSingleUserData,
        
    }
})();