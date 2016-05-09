'use strict';

$(document).ready(function () {
    // Prepare Global Window variables
    window.departmentProperty = "ICT Infrastructure - Sharepoint" // decodeURIComponent(getQueryStringParameter("Department"));
    window.hostUrl = decodeURIComponent(restHelper.getQueryStringParameter("SPHostUrl"));
    window.appWebUrl = restHelper.getQueryStringParameter("SPAppWebUrl");
    window.scriptbase = hostUrl + "/_layouts/15/";
    window.profilesSearchArray = {};
    // set window department name
    $('#teamProperty').text(departmentProperty);
    // Get initial data from search and set window
    var options = {
        queryProperty: "Department",
        queryValue: departmentProperty
    }

    // Create new Promise for Async Call

    restHelper.peopleSearchQuery(options);
    
    //populateDepartment();
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
    //    $("#uniqueUserContent").show('slow');
    //    $("#userContent").hide(1);
    //    e.preventDefault;
    //})
});