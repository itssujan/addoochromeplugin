'use strict';

!function(){
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

var buttonListener = function() {
	console.log("Clicked me");
}

chrome.pageAction.onClicked.addListener(buttonListener);

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });


console.log('\'Allo \'Allo! Event Page for Page Action');
}();