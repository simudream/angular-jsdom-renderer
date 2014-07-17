# entry point
module.exports = (grunt) ->
	
	pathUtil = require('path')
	
	libToRelease:
		expand: true
		cwd: pathUtil.join('<%=env.SRC_DIR%>')
		src: '**'
		dest: pathUtil.join('<%=env.OUT_DIR%>')