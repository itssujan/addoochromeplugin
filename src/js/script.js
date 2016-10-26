!function(){
	console.log("Im in script.js");debugger;
	var prev;
	var currentElementXPath;
	var tabURL;

	function getXPath(element) {
	    if (element.id!=='')
	        return 'id("'+element.id+'")';
	    if (element===document.body)
	        return element.tagName;

	    var ix= 0;
	    var siblings= element.parentNode.childNodes;
	    for (var i= 0; i<siblings.length; i++) {
	        var sibling= siblings[i];
	        if (sibling===element)
	            return getXPath(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
	        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
	            ix++;
	    }
	}

	var getField = function(element) {
		var field = {};
		field.tagName = element.tagName;
		if(element.className) {
			field.className = element.className;
		}
		if(element.id) {
			field.id = element.id;
		}
		if(element.tagName == 'a') {
			field.href = element.href;
		}

		var my_selector_generator = new CssSelectorGenerator;
		var selector = my_selector_generator.getSelector(element);
		field.cssSelector = selector;
		console.log("Field :"+JSON.stringify(field));	

		return field;
	}

	var clickEvent = function(event) {
		var targetElement = event.srcElement ;//|| event.srcElement;
		console.log(event.srcElement);
		if(targetElement && targetElement.id.indexOf("addoo-") <0 ) {
			console.log("Element :"+event.srcElement)
			var field = getField(targetElement);
			console.log(chrome.tabs);
			chrome.storage.local.set({"addooClickedElement" : field}, function() {
				console.log('Last clicked item added to local storage');		
      		});
			launchModal(event.srcElement);
		}
	}

	var mouseoverEvent = function(event) {
		var targetElement = event.target || event.srcElement;
		if(targetElement && targetElement.id.indexOf("addoo-") <0) {
			highlight(event)
		}	
	}

	var mouseOutEvent = function(event) {
		var targetElement = event.target || event.srcElement;
		if(targetElement && targetElement.id.indexOf("addoo-") <0) {
			resetElement(event);
		}
	}

	var saveRecording = function(title, url , data) {
		console.log("Making post request");
		$.post( "http://localhost:3001/recording", function( data ) {
		  console.log("Response :"+data);
		});

	}

	chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
		console.log("Got message :"+message.command);
		if(message.command == 'record') {
			console.log("Recording...listening to events");
			chrome.storage.sync.remove("addoo", function(result) {
				console.log("Cleared cache");
			});
			if (document.addEventListener ){
				document.addEventListener("click", clickEvent, false);
				document.addEventListener("mouseover",mouseoverEvent)
				document.addEventListener("mouseout",mouseOutEvent)
			} else if (document.attachEvent) {    //ie5-8
				document.attachEvent("onclick", function(event){
					//launchModal(event);
				});
			}
		} else if(message.command == 'stoprecord') {
			console.log("Stopping record...unlistening to events");
			if (document.addEventListener ){
				document.removeEventListener("click", clickEvent);
				document.removeEventListener("mouseover", mouseoverEvent);
				document.removeEventListener("mouseout", mouseOutEvent);
			} else if (document.attachEvent) {    //ie5-8
				document.attachEvent("onclick", function(event){
					//launchModal(event);
				});
			}
		} else if(message.command == 'saverecording') {
			console.log("Saving recording :"+message.title+" ; "+message.url);
			chrome.storage.sync.get("addoo", function(result) {
				console.log("Got from cache too :"+JSON.stringify(result));
				saveRecording(message.title,message.url,result.addoo);
			});
		} 
		// else if(request.command == 'tabURL') {
		// 	console.log("Got url :"+request.url);	
		// }

	});

	var highlight = function(event) {
		var targetElement = event.target || event.srcElement;
		if (targetElement) {
			prev = targetElement.style.border;
			targetElement.style.border = "thick solid #F38F29";
		}
	}

	var resetElement = function(event) {
		var targetElement = event.target || event.srcElement;
		if (targetElement) {
			targetElement.style.border = prev;
			prev = undefined;
		}	
	}

	var launchModal = function(targetElement) {
		console.log("Trying to open modal");
		// var targetElement = event.target || event.srcElement;
		var form = 'Title:<br><input type="text" name="addoo-title" id="addoo-title">'+
					'<br>Description:<br><textarea type="text" id="addoo-description" name="addoo-description"/>'+
					'<br><button type="button" id="addoo-submit" value="Submit">Submit</button>'

		addoomodal.open({content: form});
	}
}()