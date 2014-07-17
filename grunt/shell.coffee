# entry point
module.exports = (grunt) ->
	
	#================
	"npmDebug":
		command: "npm run-script debug"
		options:
			stdout: true
			stderr: true
			failOnError: true
			execOptions:
				cwd: "<%=env.APP_DIR%>"
	
	#================
	"npmTest":
		command: "npm test"
		options:
			stdout: true
			stderr: true
			failOnError: true
			execOptions:
				cwd: "<%=env.APP_DIR%>"
	
	#================
	"npmTestDebug":
		command: "npm run-script test.debug"
		options:
			stdout: true
			stderr: true
			failOnError: true
			execOptions:
				cwd: "<%=env.APP_DIR%>"