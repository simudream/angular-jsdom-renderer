var StringService = (function(){
	'use strict';
	
	var service = function(){};
	service.prototype = {
		// Public
		splice: function( source, offset, rem, append ) {
			return source.slice(0, offset) + append + source.slice(offset + Math.abs(rem));
		},
		// Public
		insertBefore: function(beforeString, source, stringToInsert) {
			var endOffset = source.indexOf(beforeString);
			return this.splice(source, endOffset, 0, stringToInsert);
		}
	};
	
	return service;
	
}());

var PollService = (function(){
	'use strict';

	var service = function(){};
	service.prototype = {
		// Public
		//
		// Returns {Number} timeout id
		startPollTimeout: function(window, document, angular, config) {
		
			var pollTimeoutMs = config.timeoutMs || 3000,
				timeoutId = setTimeout(
					function(){
						// store the rendered html
						var compiledHtml = document.outerHTML;
						
						// kill the timeout
						clearTimeout(timeoutId);
						
						// kill the angular window 
						service.prototype.destroyAngularWindow(window);
						
						// supply the compiled html to the done fn
						config.done(document.errors, compiledHtml);
					},
					pollTimeoutMs
				);
			
			return timeoutId;
		},
		// Public
		stopPollTimeout: function(timeoutId) {
			if (timeoutId) {
				clearTimeout(timeoutId);
				}
		},
		// Public
		//
		// Returns {Number} interval id
		startPollInterval: function(window, document, angular, config) {
			
			var pollSelectorMs = config.pollSelectorMs || 500,
				timeoutId,
				intervalId = setInterval(
					function(){
						var documentElement,
							pollElement = [];
						
						try {
							documentElement = document.querySelectorAll(config.pollSelector);
							
							// poll for an element using the poll selector
							pollElement = angular.element(documentElement);
						}catch(err) {
							throw new Error("Poll selector failed: " + err.message);
						}
						
						// if the element length is not 0 then kill this poll
						if (pollElement.length !== 0) {
							// store the rendered html
							var compiledHtml = document.outerHTML;
							
							// kill this interval
							clearInterval(intervalId);
							
							// kill the timeout
							clearTimeout(timeoutId);
							
							// kill the angular window 
							service.prototype.destroyAngularWindow(window);
							
							// supply the compiled html to the done fn
							config.done(document.errors, compiledHtml);
						}
						
					},
					pollSelectorMs
				);
			
			// run timeout fn to handle cases where selector is never found within the timeout limit
			timeoutId = setTimeout(function() {
				
				// kill the interval
				clearInterval(intervalId);
				
				// kill the angular window 
				service.prototype.destroyAngularWindow(window);
				
				// send the timeout error
				config.done([new Error('The poll selector timed out.')], null);
				
			}, config.timeoutMs || 60000);
			
			// return the id
			return intervalId;
		},
		// Public
		stopPollInterval: function(intervalId) {
			if (intervalId) {
				clearInterval(intervalId);
			}
		},
		destroyAngularWindow: function(window) {
			// get the rootScope and destroy it before closing the window otherwise stack error occurs
			var rootScope = window.angular.element(window.document).scope();
			
			if (rootScope && rootScope.$destroy) {
				rootScope.$destroy();
			}
			
			// gracefully close the window to release this process
			window.close();
		}
		
	};
	
	return service;
	
}());

var library = (function(stringService, pollService){
	'use strict';
	
	//overload: config object
	return { 
		//Public
		//
		// config - config object
		render: function(config) {
			var startPoll = pollService.startPollTimeout,
				stopPoll = pollService.stopPollTimeout;
			
			// ensure we have an object as the first argument
			if (typeof config !== 'object') {
				throw new Error("No config was supplied to render");
			}
			
			// check for a done callback
			if (typeof config.done !== 'function') {
				throw Error("You have not supplied a config.done function.");
			} else {
				config.done.bind(config);
			}
			
			// ensure we have html to render
			if (config.url === undefined && 
				config.html === undefined && 
				config.file === undefined) {
					config.done(new Error("You must supply either a config.url, config.file or config.html value."), null);
					return;
			}
			
			// set default features if not present
			if (config.features === undefined) {
				config.features = {
					FetchExternalResources   : ['script'], 
					ProcessExternalResources : ['script'],
					MutationEvents           : '2.0'
				};
			}
			
			// decides which poll to run. [timeout|interval]
			if (!config.pollSelector) {
				startPoll = pollService.startPollTimeout;
				stopPoll = pollService.stopPollTimeout;
			}
			else {
				startPoll = pollService.startPollInterval;
				stopPoll = pollService.stopPollInterval;
			}
			
			// append html to the head tag 
			if (config.html && config.headAppend) {
				config.headAppend.forEach(function(htmlToAppend) {
					config.html = stringService.insertBefore('</head>', config.html, htmlToAppend);
				});
			}
			
			// append html to the body tag 
			if (config.html && config.bodyAppend) {
				config.bodyAppend.forEach(function(htmlToAppend) {
					config.html = stringService.insertBefore('</body>', config.html, htmlToAppend);
				});
			}
			
			// begin render
			var jsdom = require("jsdom");
			
			jsdom.env({
				/* raw html. optional but must provide either url|file|html */
				html: config.html,
				/* raw file. optional but must provide either url|file|html  */
				file: config.file,
				/* raw url. optional but must provide either url|file|html  */
				url: config.url,
				/* injects script urls in to the html to be rendered */
				scripts: config.scripts,
				/* injects script statements in to the html to be rendered */
				src: config.src,
				/* see jsdom for more info - https://github.com/tmpvar/jsdom#how-it-works */
				features: config.features,
				/* see jsdom for more info - https://github.com/tmpvar/jsdom#doneerrors-window */
				done: function(errors, window) {
					if (errors) {
						config.done(errors, null);
						return;
					}
					
					var pollId, document = window.document;
					
					// pass any objects to the window.
					if (config.global) {
						for(var propertyName in config.global) {
							if ( config.global.hasOwnProperty(propertyName) ) {
								window[propertyName] = config.global[propertyName];
							}
						}
					}
					
					// listen for errors
					document.addEventListener("error", function(errorMsg, url, lineNumber){
						stopPoll(pollId);
						config.done([new Error(errorMsg, url, lineNumber)], null);
					}, false);
					
					// listen for the document load event
					document.addEventListener("load", function(){
						var angular = window.angular;
						
						if (!angular) {
							config.done([new Error("AngularJs library was not detected.")], null);
							return;
						}
						
						pollId = startPoll(window, document, angular, config);
						
					}, false);
					
					if (document.readyState === 'complete') {
						config.done(document.errors, document.outerHTML);
					}
					
				}
			});
		},
		//Public
		//
		// configArray - array of config objects to render 
		renderMany: function (configArray) {
			
			// ensure we have an array
			if (! Array.isArray(configArray)) {
				throw new Error("No config array was supplied to renderMany");
			}
			
			var me = this;
			
			// queue each render
			configArray.forEach(function(config) {
				me.render(config);
			});
			
		}
	};
	
}(new StringService(), new PollService()));

/* export the library */
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	/* node */
	module.exports = library;
} 