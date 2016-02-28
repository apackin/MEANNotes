

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

// Error handling for nonexistant paths
app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});



// forbidden path
app.get('/forbidden', function(req,res){
	res.sendStatus(403);
});

// send main index file
app.get('/*', function (req, res) {
    res.sendFile(app.get('indexHTMLPath'));
});

// Specific internal server error
app.get('/broken', function(req,res){
	res.sendStatus(500);
});

// Error catching endware for next() after database calls.
app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});


module.exports = app;