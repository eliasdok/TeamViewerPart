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
};

function drawSingleUserData() {
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

function populateDepartment() {
    // Find all available departments and populate the selection list
}
