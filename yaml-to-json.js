const YAML = require('yamljs'),
	fs = require('fs'),
  log = console.log.bind(console);
  
var doc = require('./working-files.yaml')

var json = YAML.parse(doc)

log(JSON.stringify(json, null, 2))