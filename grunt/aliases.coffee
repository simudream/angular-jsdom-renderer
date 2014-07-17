module.exports =
	
	#================
	"default": [
		"compile"
	]
	
	#================
	"compile": [
		"clean:removeArtifacts"
		"jshint:compile"
		"copy:libToRelease"
		"uglify:min"
	]
	
	#================
	"build": [
		"install"
		"compile"
	]
	
	#================
	"test": [
		"compile"
		"shell:npmTest"
	]
	
	#================
	"test.debug": [
		"compile"
		"shell:npmTestDebug"
	]