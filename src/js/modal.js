				var addoomodal = (function(){
				var 
				method = {},
				$overlay,
				$modal,
				$content,
				$close,
				$submitForm

				// Generate the HTML and add it to the document
				$overlay = $('<div id="addoo-chrome-overlay"></div>');
				$modal = $('<div id="addoo-chrome-modal" style="width:450px;height:400px"></div>');
				$content = $('<div id="addoo-chrome-content"></div>');
				$close = $('<a id="addoo-chrome-close" href="#">close</a>');


				function guid() {
				  function s4() {
				    return Math.floor((1 + Math.random()) * 0x10000)
				      .toString(16)
				      .substring(1);
				  }
				  return "addoo-"+s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				    s4() + '-' + s4() + s4() + s4();
				}


				// Center the modal in the viewport
				method.center = function () {
					var top, left;

					top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
					left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

					$modal.css({
						top:top + $(window).scrollTop(), 
						left:left + $(window).scrollLeft()
					});
				};

				// Open the modal
				method.open = function (settings) {
					if($('#addoo-chrome-modal').length == 0) {
						$('body').append($overlay, $modal);
					}
					$content.empty().append(settings.content);

					$modal.css({
						width: settings.width || 'auto', 
						height: settings.height || 'auto'
					});

					method.center();
					$(window).bind('resize.modal', method.center);
					$modal.show();
					$overlay.show();
					registerClick();
				};

				// Close the modal
				method.close = function () {
					$modal.hide();
					$overlay.hide();
					$content.empty();
					$(window).unbind('resize.modal');
				};

				method.submitForm = function(title, description, field){
					addCache(title, description, field);
					method.close();
				}


				$modal.hide();
				$overlay.hide();
				$modal.append($content, $close);
				var unqiueID = guid();

				$(document).ready(function(){
					$('body').append($overlay, $modal);
				});

				$close.click(function(e){
					e.preventDefault();
					method.close();
				});

				registerClick = function(){
					$("#addoo-submit").click(function(e){
						var title = $("#addoo-title").val();
						var description = $("#addoo-description").val();
						var clickedField;
						chrome.storage.local.get("addooClickedElement", function(result) {	
							clickedField = result.addooClickedElement;
							method.submitForm(title, description,clickedField);
							// chrome.tabs.getCurrent(function (tab) {
							//     var url = tab.url;
							//     console.log("Page URL :"+url);
							//     method.submitForm(title, description,clickedField);
							// });
						});
					})
				}

				var addCache = function(title, description, field) {
					chrome.storage.local.get("addoo", function(result) {
						if(result.addoo) {
							var step = result.addoo;
							step.push({"field":field,"title":title,"description":description});
							chrome.storage.local.set({"addoo" : step}, function() {
	      						console.log('Settings updated');		
	      					});
						} else {
							var step = [];
			            	step.push({"field":field,"title":title,"description":description});
							chrome.storage.local.set({"addoo" : step}, function() {
      							console.log('Settings saved');		
      						});
						}
					})
				}

				return method;
			}());
