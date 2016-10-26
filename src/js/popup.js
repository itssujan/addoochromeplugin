'use strict';

function init() {

    var logout = function() {
        console.log("Logging out user");
        $.post( "http://localhost:3001/logout", function( data ) {
            chrome.storage.local.remove('user', function(result){
                console.log("Cleared");
                $("#addoo-loginDiv").show();
                $("#addoo-activity-record").hide();
                $("#addoo-activity-stoprecord").hide();
            });
        });

    }

    var isloggedin = function() {
        $.get( "http://localhost:3001/loggedin", function( data ) {
            console.log("Is loggedin :"+JSON.stringify(data));
            if(data == "0") {
                logout();
            }
        });
    }

    var saveRecording = function(title) {
        console.log("Inside save recording");
        chrome.storage.local.get('addoo', function(result){
            console.log("Inside localstorage get :"+JSON.stringify(result));
            var walkthrough = {};
            walkthrough.name = title;
            walkthrough.steps = result.addoo;
            console.log("Making call");
            $.post( "http://localhost:3001/walkthrough",walkthrough, function( data ) {
                console.log("Walkthru response : "+JSON.stringify(data));
            });
        });
    }

    // Message and button containers
    console.log("In init");
    isloggedin()

    chrome.storage.local.get(['user','record'], function (result) {
        if(result.user) {
            if(result.record == 'start') {
                $("#addoo-loginDiv").hide();
                $("#addoo-activity-record").hide();    
                $("#addoo-activity-stoprecord").show();    
            } else {
                $("#addoo-loginDiv").hide();
                $("#addoo-activity-record").show();    
            }
            
        }
    });

        // $.get("http://localhost:3001/loggedin", function( data ) {
        //     console.log("IS Loggedin :"+JSON.stringify(data));
        //     if(data._id) {
        //         $("#loginDiv").hide();
        //         $("#loggedinuser").show();
        //     }
        // });

    // Log in button
    $("#addoo-login").click(function () {
        console.log("Trying to login");
        var email = $("#addoo-user").val();
        var password = $("#addoo-password").val();
        var user = {};
        user.email = email;
        user.password = password;
        console.log("USER :"+JSON.stringify(user));
        $.post( "http://localhost:3001/login",user, function( data ) {
        	console.log("Success");
            chrome.storage.local.set({'user':data.user});
            user = data.user;
        	if(data.user._id) {
        		$("#addoo-loginDiv").hide();
        		$("#addoo-activity-record").show();
        	}
        	console.log(data)
		});
    });

    $(".addoo-logout").click(function () {
        console.log("Clicked logout");
        logout();
    });

    $("#addoo-record").click(function() {
        console.log("Clicked record");
        $("#addoo-activity-record").hide();
        $("#addoo-activity-stoprecord").show();
        chrome.storage.local.set({'record':'start'});
        chrome.storage.local.remove('addoo');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,{command:"record"}, function(response){
                console.log("Got response");
            });
        });
    })

    $("#addoo-stop-record").click(function() {
        console.log("Clicked stop record");
        $("#addoo-span3").show();
        $("#addoo-stop-record").hide();
        chrome.storage.local.set({'record':'stop'});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,{command:"stoprecord"}, function(response){
                console.log("Got response");
            });
        });
    })

    $("#addoo-save-record").click(function() {
        console.log("Clicked save record");
        var title = $("#addoo-record-title").val();
        chrome.storage.local.remove('record');
        saveRecording(title);
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        //     // chrome.tabs.sendMessage(tabs[0].id,{command:"saverecording", url : tabs[0].url, title : $("#addoo-record-title").val()}, function(response){
        //     //     console.log("Got response");
        //     //     saveRecording(title);
        //     // });
        // });
    })

}
$(document).ready(init);
