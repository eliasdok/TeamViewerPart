function drawUserData() {
    $('#userContent').empty();
    // store all searchPeopleResults in an easy to access variable
    var data = restHelper.objectCache.searchPeopleResults;
    // Get all own property keys from data (doesnt include inherited)
    _.each(data, function (person) {
        var pictureUrl = "https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=" + person.WorkEmail + "&size=HR120x120"
        // Iterate through each person and draw HTML into the screen
        if (person.PictureURL == null) {
            var pictureUrlHtml = "<div class='userPictureSmall'> <img width='76px' src='"
                + hostUrl + "/_layouts/15/images/PersonPlaceholder.200x150x32.png'</img></div>"
        } else {
            var pictureUrlHtml = "<div class='userPictureSmall'> <img src='"
                + pictureUrl + "'></img></div>"
        }
        var html = "<div class='personContainerSmall' id='" + person.UserProfile_GUID + "'>"
            + pictureUrlHtml
            + "<div class='userDetailsSmall'><p>"
            + person.PreferredName
            + "</p><p>"
            + person.JobTitle
            + "</p></div></div>"
        $('#userContent').append(html);
    })
    // Create event that fetches single user data from Profile service and set into unique content when clicked
    $("#userContent").click(function (e) {
        //Finds the closest paretn DOM element that matches the query, returns an array [0] required
        var userProfileGUID = $(e.target).closest('div[class="personContainerSmall"]')[0].id;
        var uniquePerson = restHelper.objectCache.searchPeopleResults[userProfileGUID];
        // Cross Domain request required from app to host URL as Profiles is not available
        // Add logic so that if user has already been loaded into the cache a REST call does not need to be made
        var userProfileSearchOptions = {
            accountName: uniquePerson.AccountName,
            userGUID: uniquePerson.UserProfile_GUID
        }
        var promise = Promise.resolve($.getScript(scriptbase + "SP.RequestExecutor.js", function () {
            return restHelper.userProfileAccountQuery(userProfileSearchOptions)
        }));
        promise.then(drawSingleUserData(uniquePerson));
        $("#uniqueUserContent").show('slow');
        $("#userContent").hide(1);
        e.preventDefault;
    })
};

function drawSingleUserData(uniquePerson) {
    // Switch out url for MThumb(medium thumbnail) for LThumb(Large thumbnail) or insert placeholder if NULL
    if (!uniquePerson.PictureURL) {
        var pictureUrl = "/_layouts/15/images/PersonPlaceholder.200x150x32.png"
    } else {
        var pictureUrl = (uniquePerson.PictureURL.substring(0, (uniquePerson.PictureURL.length) - 10)) + "LThumb.jpg"
    }
    $("#userPictureLarge").html("<img height='200px' src='" + pictureUrl + "'></img>");
    $("#userNameLarge").html("<p>" + uniquePerson.PreferredName + "</p>");
    $("#userTitleLarge").html("<p>" + uniquePerson.JobTitle + "</p>");
    $("#userDepartmentLarge").html("<p>" + uniquePerson.Department + "</p>");
    $("#userTelephoneLarge").html("<p>" + uniquePerson.WorkPhone + "</p>");
}

function populateDepartment() {
    // Find all available departments and populate the selection list
}
