"use strict";

// Import
var expect = require('chai').expect,
    joe = require('joe');

// Test
joe.describe('String Service', function (describe, test) {
    var services = require('../lib/angular-jsdom-renderer').services;

    test("insertBefore succeeds", function () {
        var test = "<html><head></head></html>";
        var expected = "<html><head><script /></head></html>";

        var actual = services.stringService.insertBefore("</head>", test, "<script />")
        expect(actual).to.deep.equal(expected);
    });

});