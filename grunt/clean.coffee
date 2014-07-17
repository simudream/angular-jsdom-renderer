# entry point
module.exports = (grunt) ->
	
	pathUtil = require("path")
	
	removeModules:
		force: true
		src: [
			pathUtil.join("<%=env.MODULES_DIR%>")
		]
		
	removeArtifacts:
		force: true
		src: [
			pathUtil.join("<%=env.OUT_DIR%>")
		]