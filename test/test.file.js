"use strict";

// Import
var expect = require('chai').expect,
    joe = require('joe');

// Test
joe.describe('File', function (describe, test) {
    var renderer = require('../lib/angular-jsdom-renderer'),
        path = require('path');

    // use cwd as are document url location
    var fileAsset = path.join.bind(null, __dirname, 'assets');

    test("Renders shared data", function (next) {
        var testData = "Hello world!";

        renderer.render({

            /* file */
            file: fileAsset('index.html'),

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