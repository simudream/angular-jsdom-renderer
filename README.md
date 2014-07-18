# Angular JSDom Renderer

[![Build Status](https://secure.travis-ci.org/pflannery/angular-jsdom-renderer.png?branch=master)](http://travis-ci.org/pflannery/angular-jsdom-renderer "Check this project's build status on TravisCI")
[![NPM version](https://badge.fury.io/js/angular-jsdom-renderer.png)](https://npmjs.org/package/angular-jsdom-renderer "View this project on NPM")
[![Dependency Status](https://gemnasium.com/pflannery/angular-jsdom-renderer.png)](https://gemnasium.com/pflannery/angular-jsdom-renderer)
[![Gittip donate button](http://img.shields.io/gittip/pflannery.png)](https://www.gittip.com/pflannery/ "Donate weekly to this project using Gittip")
[![Analytics](https://ga-beacon.appspot.com/UA-47157500-1/angular-jsdom-renderer/readme)](https://github.com/pflannery/angular-jsdom-renderer)

Helps render angular pages on the server-side.

## Installation

    npm install angular-jsdom-renderer

## Usage

```javascript

// render using an interval poll selector
var renderer = require('angular-jsdom-renderer');

renderer.render({
	/* url to retrieve the html from */
	url: 'http://localhost:7559/',

	/* poll this selector until a match is found */
	pollSelector: 'body[data-content-loaded=true]. default undefined',
	
	/* how often to poll the given selector. default 500 */
	pollSelectorMs: 100,
	
	/* how long to wait to give up polling selector. default 60000 */
	timeoutMs: 60000,
	
	/* complete callback. this = config */
	done: function(errors, window) {
		if (errors) {
			console.log(errors);
			return;
		}

        var document = window.document;
        var compiledHtml = document.outerHTML;
		// var angular = window.angular
		console.log(compiledHtml);

		// window will close after this callback
	}
});
```

```javascript
// render using a timeout only
var renderer = require('angular-jsdom-renderer');

renderer.render({
	/* url to retrieve the html from */
	url: 'http://localhost:7559/',
	
	/* how long to wait until rendering the content. default 5000 */
	timeoutMs: 5000,
	
	/* complete callback. this = config */
	done: function(errors, window) {
		if (errors) {
			console.log(errors);
			return;
		}
		
        var document = window.document;
        var compiledHtml = document.outerHTML;
		// var angular = window.angular
		console.log(compiledHtml);

		// window will close after this callback
	}
});

```

####Run the examples


- [Poll and display shared data](examples/share-data)
```bash
npm i
node render.js
```

- [Using dynamic html and head scripts](examples/html-strings)
```bash
npm i
node render.js
```


## API

```javascript

	/* renders the give url or file or html string */
	
	render({
		/* raw html. optional but must provide either url|file|html */
		html: '',
		/* raw file. optional but must provide either url|file|html  */
		file: config.file,
		/* raw url. optional but must provide either url|file|html  */
		url: '',
		/* injects script urls in to the html to be rendered */
		scripts: [],
		/* injects script statements in to the html to be rendered */
		src: [],
		/* see jsdom for more info - https://github.com/tmpvar/jsdom#how-it-works */
		features: config.features,
		/* see jsdom for more info - https://github.com/tmpvar/jsdom#doneerrors-window */
		done: function(jsdomErrors, window){},
		/* polls a selector until a match is found and then passes the rendered html to the config.done callback */
		pollSelector: 'body[data-content-loaded=true]'. default '',
		/* how often to poll the given selector. default 500 */
		pollSelectorMs: 500,
		/* how long to wait to give up polling selector. default 60000 */
		timeoutMs: 60000,
	});
	
```

## Contributing
Feel free to submit ideas and issues.

## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright &copy; 2014+ Stringz Solutions Ltd
<br/>Copyright &copy; 2014+ [Peter Flannery](http://github.com/pflannery)
