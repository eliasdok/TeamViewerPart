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
    window.departmentProperty = decodeURIComponent(getQueryStringParameter("Department"));
    window.hostUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    window.appWebUrl = getQueryStringParameter("SPAppWebUrl");
    window.scriptbase = hostUrl + "/_layouts/15/";
    window.profilesSearchArray = {};
    // set window department name
    $('#teamProperty').text(departmentProperty);
    // Get initial data from search and set window
    var options = {
        queryProperty: "Department",
        queryValue: departmentProperty
    }
    restPeopleSearchQuery(options);
    //// next step requires a promise to ensure the data has been pulled before continuing
    //$("#uniqueUserContent").click(function (e) {
    //    $("#userContent").show(1);
    //    $("#uniqueUserContent").hide("slow");
    //    e.preventDefault;
    //})
    //// Fetch single user data from Profile service and set into unique content when clicked
    //$("#userContent").click(function (e) {
    //    //$(e.target).parent('div[class="personContainerSmall"]')
    //    var parentDiv = e.target.closest('div[class="personContainerSmall"]');
    //    var userProfileGUID = parentDiv.id;
    //    window.uniquePerson = profilesSearchArray[userProfileGUID];
    //    // Cross Domain request required from app to host URL as Profiles is not available
    //    // Add logic so that if user has already been loaded into the cache a REST call does not need to be made
    //    $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
    //        getSingleUserData();
    //    });
    //    $("#userContent").hide(1);
    //    $("#uniqueUserContent").show('slow');
    //    e.preventDefault;
    //})
});

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
            $('#userContent').append(html);
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
