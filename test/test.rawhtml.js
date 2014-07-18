"use strict";

// Import
var expect = require('chai').expect,
    joe = require('joe');

// Test
joe.describe('Raw Html', function (describe, test) {
    var renderer = require('../lib/angular-jsdom-renderer'),
        path = require('path');

    // use cwd as are document url location
    var fileAsset = path.join.bind(null, "file:", "", __dirname);

    test("Renders shared data", function (next) {
        var testData = "Hello world!";

        var testHtml = '<!DOCTYPE html>\
                    <html ng-app="testApp">\
                        <head></head>\
                        <body ng-controller="testController" data-ready="{{ready}}">\
                            <div>The message is {{message}}</div>\
                        </body>\
                    </html>';

        var expectedLength = 1016;

        renderer.render({

            /* html */
            html: testHtml,

            /* appends html before the </head> tag*/
            headAppend: [
                '<script type="text/javascript" src="' + fileAsset('assets/libs/angularjs/1.3.0/angular.min.js') + '"></script>',
                '<script type="text/javascript" >\
                    var module = angular.module("testApp", []);\
                    module.controller("testController", function($scope) {\
                        $scope.message = window.message;\
                        $scope.ready = true;\
                    });\
                </script>'
            ],

            /* polls for this selector until a match is found */
            pollSelector: 'body[data-ready=true]',

            /* share data to the renderer's window object */
            global: {
                message: testData
            },

            /* complete callback. this = config */
            done: function (errors, window) {
                if (errors) {
                    next(errors);
                    return;
                }

                var document = window.document;
                var compiledHtml = document.outerHTML;

                // test the content length
                expect(compiledHtml.length).to.deep.equal(expectedLength);

                // test the $scope.message
                var angular = window.angular;
                var scopeElement = angular.element( document.querySelector("body"));
                var actual = scopeElement.scope().message;
                expect(actual).to.deep.equal(testData);

                next();
            }

        });

    });


});