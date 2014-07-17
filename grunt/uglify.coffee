module.exports = (grunt) ->

	'use strict'
	
	pathUtil = require("path")
	
	min:
		files:
			"<%=env.OUT_DIR%>/<%=env.OUT_MIN_FILE%>": [pathUtil.join("<%=env.OUT_DIR%>", "**/*.js")]