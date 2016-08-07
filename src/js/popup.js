'use strict';

function init() {

	console.log("INIT");
    // Message and button containers
    var lout = $("#trello_helper_loggedout");
    var lin = $("#trello_helper_loggedin");

    // Log in button
    $("#login").click(function () {
        console.log("Trying to login");
        var email = $("#user").val();
        var password = $("#password").val();
        var user = {};
        user.email = email;
        user.password = password;
        console.log("USER :"+JSON.stringify(user));
        $.post( "https://node.addoo.io/login",user, function( data ) {
        	console.log("Success");
        	if(data.user._id) {
        		$("#loginDiv").hide();
        		$("#loggedinuser").show();
        	}
        	console.log(data)
		});
    });



    // Log out button
    $("#trello_helper_logout").click(function () {
        
    });

    if (!localStorage.trello_token) {
        $(lout).show();
        $(lin).hide();
    } else {
        $(lout).hide();
        $(lin).show();
    }
}
$(document).ready(init);
