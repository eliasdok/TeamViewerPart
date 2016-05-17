'use strict';

// Prepare Global Window variables
var departmentProperty = "ICT Infrastructure - Sharepoint" // GetUrlKeyValue("Department"));
var hostUrl = GetUrlKeyValue("SPHostUrl");
var appWebUrl = GetUrlKeyValue("SPAppWebUrl");
var scriptbase = hostUrl + "/_layouts/15/";

$(document).ready(function () {
    // set window department name
    $('#teamProperty').text(departmentProperty);
    // Get initial data from search and set window
    var peopleSearchOptions = {
        queryProperty: "Department",
        queryValue: departmentProperty
    }

    // Get all users by department as a Promise for Async Call
    restHelper.peopleSearchQuery(peopleSearchOptions).then(drawUserData);
    
    // TODO populateDepartment();

    // Create event for clicking unique user details
    $("#uniqueUserContent").click(function (e) {
        $("#userContent").show("slow");
        $("#uniqueUserContent").hide(1);
        e.preventDefault;
    })

});