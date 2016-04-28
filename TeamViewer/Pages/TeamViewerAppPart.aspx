<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title></title>

    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>


    <!-- Add custom Javascript Here -->
    <script type="text/javascript" src="../Scripts/bluebird.min.js"></script>
    <script type="text/javascript" src="../Scripts/AppMix.js"></script>
    <script type="text/javascript" src="../Scripts/RestHelper.js"></script>
    <script type="text/javascript" src="../Scripts/AppPart.js"></script>

    <!-- Custom StyleShee -->
    <link rel="stylesheet" href="../Content/App.css" />
    <script type="text/javascript">

        'use strict';

        // Set the style of the client web part page to be consistent with the host web.
        (function () {
            var hostUrl = '';
            if (document.URL.indexOf('?') != -1) {
                var params = document.URL.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var p = decodeURIComponent(params[i]);
                    if (/^SPHostUrl=/i.test(p)) {
                        hostUrl = p.split('=')[1];
                        document.write('<link rel="stylesheet" href="' + hostUrl + '/_layouts/15/defaultcss.ashx" />');
                        break;
                    }
                }
            }
            if (hostUrl == '') {
                document.write('<link rel="stylesheet" href="/_layouts/15/1033/styles/themable/corev15.css" />');
            }
        })();
    </script>
</head>
<body>
    <p id="teamProperty"></p>
    <p id="urlString"></p>
    <div id="userContent">
        <p>Loading User Data..</p>
    </div>
    <div id="uniqueUserContent">
        <div id="userPictureLarge"></div>
        <div id="userDetailsLarge"></div>
        <h1>User Name</h1>
        <div id="userNameLarge"></div>
        <h2>Title</h2>
        <div id="userTitleLarge"></div>
        <h3>Department</h3>
        <div id="userDepartmentLarge"></div>
        <h4>Telephone</h4>
        <div id="userTelephoneLarge"></div>
    </div>
</body>
</html>
