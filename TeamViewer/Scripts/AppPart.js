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