var StringService = (function () {
    'use strict';

    var service = function () {
    };
    service.prototype = {
        // Public
        splice: function (source, offset, rem, append) {
            return source.slice(0, offset) + append + source.slice(offset + Math.abs(rem));
        },
        // Public
        insertBefore: function (beforeString, source, stringToInsert) {
            var endOffset = source.indexOf(beforeString);
            return this.splice(source, endOffset, 0, stringToInsert);
        }
    };

    return service;

}());

var PollService = (function () {
    'use strict';

    var service = function () {
    };
    service.prototype = {
        // Public
        //
        // Returns {Number} timeout id
        startPollTimeout: function (window, document, angular, config) {

            var pollTimeoutMs = config.timeoutMs || 3000,
                timeoutId = setTimeout(
                    function () {
                        // kill the timeout
                        clearTimeout(timeoutId);

                        // supply the window to the done fn
                        config.done(document.errors, window);

                        // kill the angular window
                        service.prototype.destroyAngularWindow(window);

                    },
                    pollTimeoutMs
                );

            return timeoutId;
        },
        // Public
        stopPollTimeout: function (timeoutId) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        },
        // Public
        //
        // Returns {Number} interval id
        startPollInterval: function (window, document, angular, config) {

            var pollSelectorMs = config.pollSelectorMs || 500,
                timeoutId,
                intervalId = setInterval(
                    function () {
                        var documentElement,
                            pollElement = [];

                        try {
                            documentElement = document.querySelectorAll(config.pollSelector);

                            // poll for an element using the poll selector
                            pollElement = angular.element(documentElement);
                        } catch (err) {
                            throw new Error("Poll selector failed: " + err.message);
                        }

                        // if the element length is not 0 then kill this poll
                        if (pollElement.length !== 0) {

                            // kill this interval
                            clearInterval(intervalId);

                            // kill the timeout
                            clearTimeout(timeoutId);

                            // supply the window to the done fn
                            config.done(document.errors, window);

                            // kill the angular window
                            service.prototype.destroyAngularWindow(window);
                        }

                    },
                    pollSelectorMs
                );

            // run timeout fn to handle cases where selector is never found within the timeout limit
            timeoutId = setTimeout(
                function () {

                    // kill the interval
                    clearInterval(intervalId);

                    // send the timeout error
                    config.done([new Error('The poll selector timed out.')], window);

                    // kill the angular window
                    service.prototype.destroyAngularWindow(window);

                },
                config.timeoutMs || 60000
            );

            // return the id
            return intervalId;
        },
        // Public
        stopPollInterval: function (intervalId) {
            if (intervalId) {
                clearInterval(intervalId);
            }
        },
        destroyAngularWindow: function (window) {

            // get all ng-app elements
            var rootScopeElements = window.document.querySelectorAll('*[ng-app]');
            if (typeof rootScopeElements === 'undefined' ||
                rootScopeElements == null) {
                throw new Error("ng-app was not found in the document.")
            }

            for (var index = 0; index < rootScopeElements.length; index++) {
                // get the rootScope element
                var rootScopeElement = rootScopeElements[index];

                // get the scope
                var rootScope = window.angular.element(rootScopeElement).scope();
                if (typeof rootScope === 'undefined') {
                    throw new Error("No scope object found using the rootScopeSelector.")
                }

                // destroy the rootScope before closing the window otherwise stack error can occur
                rootScope.$destroy();

            }

            // close the window
            window.close();
        }

    };

    return service;

}());

var library = (function (stringService, pollService) {
    'use strict';

    return {
        //Public
        //
        // config - config object
        render: function (config) {
            var startPoll = pollService.startPollTimeout,
                stopPoll = pollService.stopPollTimeout;

            // ensure we have a config
            if (typeof config === 'undefined' || config === null) {
                throw new Error("No config was supplied to render.");
            }

            // ensure we have a done callback
            if (typeof config.done !== 'function') {
                throw Error("You have not supplied a config.done function.");
            } else {
                config.done.bind(config);
            }

            // ensure we have a html source to render
            if (typeof config.url === 'undefined' &&
                typeof config.html === 'undefined' &&
                typeof config.file === 'undefined') {
                throw new Error("You must supply either a config.url, config.file or config.html value.");
                return;
            }

            // set default features if not present
            if (typeof config.features === 'undefined') {
                config.features = {
                    FetchExternalResources: ['script'],
                    ProcessExternalResources: ['script'],
                    MutationEvents: '2.0'
                };
            }

            // decides which poll to run. [timeout|interval]
            if (typeof config.pollSelector === 'undefined') {
                startPoll = pollService.startPollTimeout;
                stopPoll = pollService.stopPollTimeout;
            }
            else {
                startPoll = pollService.startPollInterval;
                stopPoll = pollService.stopPollInterval;
            }

            // append any html to the head tag (config.html mode only)
            if (typeof config.html !== 'undefined' && typeof config.headAppend !== 'undefined') {
                config.headAppend.forEach(function (htmlToAppend) {
                    config.html = stringService.insertBefore('</head>', config.html, htmlToAppend);
                });
            }

            // append html to the body tag (config.html mode only)
            if (typeof config.html !== 'undefined' && typeof config.bodyAppend !== 'undefined') {
                config.bodyAppend.forEach(function (htmlToAppend) {
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
                done: function (errors, window) {
                    if (errors) {
                        config.done(errors, window);
                        return;
                    }

                    var pollId, document = window.document;

                    // pass any objects to the window.
                    if (config.global) {
                        for (var propertyName in config.global) {
                            if (config.global.hasOwnProperty(propertyName)) {
                                window[propertyName] = config.global[propertyName];
                            }
                        }
                    }

                    // listen for any document errors
                    document.addEventListener("error", function (errorMsg, url, lineNumber) {
                        stopPoll(pollId);
                        config.done([new Error(errorMsg, url, lineNumber)], window);
                    }, false);

                    // listen for the document load event
                    document.addEventListener("load", function () {
                        var angular = window.angular;

                        if (!angular) {
                            config.done([new Error("AngularJs library was not detected.")], window);
                            return;
                        }

                        pollId = startPoll(window, document, angular, config);

                    }, false);

                    if (document.readyState === 'complete') {
                        config.done(document.errors, window);
                    }

                }
            });
        },
        //Public
        //
        // configArray - array of config objects to render
        renderMany: function (configArray) {

            // ensure we have an array
            if (!Array.isArray(configArray)) {
                throw new Error("No config array was supplied to renderMany");
            }

            var me = this;

            // queue each render
            configArray.forEach(function (config) {
                me.render(config);
            });

        },
        services: {
            stringService: stringService,
            pollService: pollService
        }
    };

}(new StringService(), new PollService()));

/* export the library */
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    /* node */
    module.exports = library;
} 