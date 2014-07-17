module.exports = (grunt, gruntRootPath) ->
	'use strict'
	pathUtil = require("path")

	env = {}
	env.APP_DIR = process.cwd()
	env.WINDOWS = process.platform.indexOf('win') is 0
	env.NODE = process.execPath
	env.NPM = (if env.WINDOWS then process.execPath.replace('node.exe', 'npm.cmd') else 'npm')
	env.EXT = (if env.WINDOWS then '.cmd' else '')
	env.EXTD_PATH = pathUtil.join(env.APP_DIR, ".cake")
	env.PACKAGE_PATH = pathUtil.join(env.APP_DIR, "package.json")
	env.PACKAGE_DATA = require(env.PACKAGE_PATH)
	
	env.SRC_DIR = pathUtil.join(env.APP_DIR, "lib")
	env.OUT_DIR = pathUtil.join(env.APP_DIR, "out")
	
	env.MODULES_DIR = pathUtil.join(env.APP_DIR, "node_modules")
	env.BIN_DIR = pathUtil.join(env.MODULES_DIR, ".bin")
	env.COFFEE = pathUtil.join(env.BIN_DIR, "coffee#{env.EXT}")
	
	env.TEST_DIR      	= pathUtil.join(env.APP_DIR, "test")
	env.TEST_SRC_DIR	= pathUtil.join(env.TEST_DIR, "")
	env.TEST_OUT_DIR	= pathUtil.join(env.TEST_DIR, "out")

	
	outFilename = pathUtil.basename(process.cwd())
	if outFilename.substring(outFilename.length-2) == 'js'
		outFilename = outFilename.substring(0, outFilename.length-2)
	
	
	env.OUT_BUNDLE_FILE	= outFilename + ".js"
	env.OUT_MIN_FILE	= outFilename + ".min.js"
	
	env.CLEAN_FOLDERS 	= ["out", 
							"out-actual",
							"log"]

	config =
		env: env

	return config