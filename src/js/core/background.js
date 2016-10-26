'use strict';

!function(){
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {command: 'tabURL', url : tabs[0].url}, function(response) {
    console.log(response.farewell);
  });
});


var buttonListener = function() {
	console.log("Clicked me");
}

chrome.pageAction.onClicked.addListener(buttonListener);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("Got request");
	if (request.method == "addLocalStorage"){
		var uniqueID = request.key;
		var title = request.title;
		var description = request.description;
		var xpath = request.xpath;
		console.log("videogularVolume :"+localStorage['videogularVolume']);

		// chrome.local.storage.get(uniqueID, function (result) {
  //           console.log(uniqueID);
  //           if(result.uniqueID) {
  //           	console.log("Got local storage :"+result.uniqueID);
  //           } else {
  //           	console.log("Setting to local storage");
  //           	var step = [];
  //           	step.push({"xpath":xpath,"title":title,"description":description});
		// 		chrome.local.storage.set({uniqueID:step});
  //           }
  //       });
        sendResponse({});
	}
    else
    sendResponse({}); // snub them.
});


console.log('********* BACKGROUND SCRIPT EXECUTED');
}();