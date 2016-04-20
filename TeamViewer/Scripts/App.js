'use strict';

/*
var Template.temp1 = `<div>
{{accountName}}
{{#each z}}
    {{a}}
{{/each}}
</div>`;

var html = handlebars.render(Template.temp1,{ accountName: 'x',z : [ { a: 1 }, { a:2 } ] });
*/
/*
function App() {
    var departmentProperty = null;
    */
$(document).ready(function () {
    // Prepare Global Window variables
    window.departmentProperty = "Customer Services" // decodeURIComponent(getQueryStringParameter("Department"));
    window.hostUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    window.appWebUrl = getQueryStringParameter("SPAppWebUrl");
    window.scriptbase = hostUrl + "/_layouts/15/";
    window.profilesSearchArray = {};
    // set window department name
    $('#teamProperty').text(departmentProperty);
    // Get initial data from search and set window
    getUserData();
    populateDepartment();
    $("#uniqueUserContent").click(function (e) {
        $("#userContent").show(1);
        $("#uniqueUserContent").hide("slow");
        e.preventDefault;
    })
    // Fetch single user data from Profile service and set into unique content when clicked
    $("#userContent").click(function (e) {
        //$(e.target).parent('div[class="personContainerSmall"]')
        var parentDiv = e.target.closest('div[class="personContainerSmall"]');
        var userProfileGUID = parentDiv.id;
        window.uniquePerson = profilesSearchArray[userProfileGUID];
        // Cross Domain request required from app to host URL as Profiles is not available
        // Add logic so that if user has already been loaded into the cache a REST call does not need to be made
        $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
            getSingleUserData();
        });
        $("#uniqueUserContent").show('slow');
        $("#userContent").hide(1);
        e.preventDefault;
    })
});

function populateDepartment() {
    for (var k in profilesSearchArray) {
        var departmentList = {};
        if (!(departmentList.indexOf contains k.Department)) {
            departmentList.add(k.Department)
}
    }
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

// Use people search to get all users with same department as web part property
function getUserData() {
    var searchUrl = "/_api/search/query?querytext='Department:" + departmentProperty + "'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'";
    var fullUrl = appWebUrl + searchUrl;
    console.log(fullUrl);
    // REST Call to retrieve user data based on web part properties
    jQuery.ajax(
        {
            url: fullUrl,
            type: "GET",
            headers: {
                "accept": "application/json; odata=verbose",
                "content-type": "application/json; odata=verbose"
            },
            success: onGetUserDataSucceeded,
            error: onGetUserDataFailed
        }
    );
}

function onGetUserDataSucceeded(data) {
    $('#appContent').empty();
    var data = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
    parseUserData(data)
    drawUserData()
}

function onGetUserDataFailed() {
    $('#appContent').text('Failed to Load User Data')
}

//function getUniqueContent(userProfileGUID) {
//    var result = $.grep(profilesSearchArray, function (e) { return e.userProfileGUID === userProfileGUID; });
//    return result[0];
//}

function parseUserData(data) {
    for (var i = 0; i < data.length; i++) {
        var results = data[i].Cells.results;
        // Create an object for each person and store it in the global store
        var person = {
        }
        // Loop through all returned data and create key value pair object for each
        for (var x = 0; x < results.length; x++) {
            var newPropertyName = results[x].Key
            person[newPropertyName] = results[x].Value
        }
        // Set hash table to user profile guid for easy caching and searching later
        profilesSearchArray[person.UserProfile_GUID] = person;
    }
}

function drawUserData() {
    if (!profilesSearchArray) {
        getUserData();
    }
    // As we are working with an object we cannot use length so we have to check the property against itself
    var count = 0;
    /*
    for (var k in _.keys(profilesSearchArray)) {

    }*/
    
    for (var k in profilesSearchArray) {
        if (profilesSearchArray.hasOwnProperty(k))
        {
            var person = profilesSearchArray[k]
            if (person.PictureURL == null) {
                var pictureUrlHtml = "<div class='userPictureSmall'> <img width='76px' src='"
                    + hostUrl + "/_layouts/15/images/PersonPlaceholder.200x150x32.png'</img></div>"
            } else {
                var pictureUrlHtml = "<div class='userPictureSmall'> <img src='"
                    + person.PictureURL + "'></img></div>"
            }
            var html = "<div class='personContainerSmall' id='" + person.UserProfile_GUID + "'>"
                + pictureUrlHtml
                + "<div class='userDetailsSmall'><p>"
                + person.PreferredName
                + "</p><p>"
                + person.JobTitle
                + "</p></div></div>"
            $('#appContent').append(html);
        }
    }
}

function getQueryStringParameter(urlParameterKey) {
    var params = document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split('=');
        if (singleParam[0] == urlParameterKey)
            return decodeURIComponent(singleParam[1]);
    }
}
