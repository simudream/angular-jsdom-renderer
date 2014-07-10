// render using an interval poll selector
var renderer = require('angular-jsdom-renderer');
var path = require("path");
var asset = path.join.bind(null, __dirname);

renderer.render({

	/* url to retrieve the html from */
	file: asset('index.html'),

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