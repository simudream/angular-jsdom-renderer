"use strict";

// Import
var expect = require('chai').expect,
    joe = require('joe');

// Test
joe.describe('Interface', function (describe, test) {
    var renderer = require('../lib/angular-jsdom-renderer');

    test("Render handles missing config", function () {

        try {
            renderer.render();
        } catch (err) {
            expect(err.message).to.deep.equal("No config was supplied to render.");
        }

        try {
            renderer.render(null);
        } catch (err) {
            expect(err.message).to.deep.equal("No config was supplied to render.");
        }

    });

    test("Render handles missing config.done callback", function () {

        try {
            renderer.render({});
        } catch (err) {
            expect(err.message).to.deep.equal("You have not supplied a config.done function.");
        }

    });

    test("Render handles missing config.url, config.html and config.file", function () {

        try {

            renderer.render({
                done: function(errors, window){
                    throw new Error("Done should not be fired")
                }
            });

        } catch (err) {
            expect(err.message).to.deep.equal("You must supply either a config.url, config.file or config.html value.");
        }

    });



});