// render using an interval poll selector
var renderer = require('angular-jsdom-renderer');
var path = require("path");

// use cwd as are document url location
var fileAsset = path.join.bind(null, "file:", "", __dirname);

renderer.render({

	/* html */
	html: '<!DOCTYPE html>\n\
<html ng-app="testApp">\n\
	<head></head>\n\
	<body ng-controller="testController" data-ready="{{message===123}}">\n\
		<div>The message is {{message}}</div>\n\
	</body>\n\
</html>',

	/* appends html before the </head> tag*/
	headAppend: [
		'<script type="text/javascript" src="'+fileAsset('../assets/libs/angularjs/1.3.0/angular.min.js') +'"></script>\n',
		'<script type="text/javascript" >\n\
			var module = angular.module("testApp", []);\n\
			module.controller("testController", function($scope) {\n\
				$scope.message = window.message;\n\
			});\n\
		</script>\n'
	],

	/* poll this selector until a match is found */
	pollSelector: 'body[data-ready=true]',

	/* share data to the renderer's window object */
	global: {
		message: 123
	},

	/* complete callback. this = config */
	done: function (errors, window) {
		if (errors) {
			console.log("errors", errors);
		}

        var document = window.document;
        var compiledHtml = document.outerHTML;

		console.log("Compiled content:");
		console.log("");
		console.log(compiledHtml);
	}
});