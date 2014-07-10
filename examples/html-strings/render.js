// render using an interval poll selector
var renderer = require('angular-jsdom-renderer');
var path = require("path");
var asset = path.join.bind(null, __dirname);

renderer.render({

	/* html */
	html: '<!DOCTYPE html>\
<html ng-app="testApp">\
	<head></head>\
	<body ng-controller="testController" data-ready="{{message===123}}">\
		<div>The message is {{message}}</div>\
	</body>\
</html>',

	/* appends html before the </head> tag*/
	headAppend: [
		'<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.min.js"></script>',
		'<script>\
			var module = angular.module("testApp", []);\
			module.controller("testController", function($scope) {\
				$scope.message = window.message;\
			});\
		</script>'
	],

	/* poll this selector until a match is found */
	pollSelector: 'body[data-ready=true]',

	/* share data to the renderer's window object */
	global: {
		message: 123
	},

	/* complete callback. this = config */
	done: function (errors, compiledHtml) {
		if (errors) {
			console.log("errors", errors);

		}

		console.log("compiled", compiledHtml);
	}
});