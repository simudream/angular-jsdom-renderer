# entry point
module.exports = (grunt) ->

	compile: 
		options:
			jshintrc: true
		files:
			src: ['lib/**/*.js']