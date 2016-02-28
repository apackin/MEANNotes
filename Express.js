

// Set up using express with Node
var express = require('express'),
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser');

// Set body parser to parse
app.use(bodyParser.json());
app.use('/files', express.static(path.join(__dirname, "public", "static")));

// link to router in api (included below)
app.use('/api/router', require('./api/router.js'));


app.get('/broken', function(req,res){
	res.sendStatus(500);
});

app.get('/forbidden', function(req,res){
	res.sendStatus(403);
});



module.exports = app;