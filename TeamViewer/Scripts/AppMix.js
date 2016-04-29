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
