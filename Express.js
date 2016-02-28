

// Set up using express with Node
var express = require('express'),
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser');

// Set body parser to parse
app.use(bodyParser.json());
app.use('/files', express.static(path.join(__dirname, "public", "static")));

// link to router in api (included below)
app.use('/api/item', require('./api/item.js'));

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


// router.js using es6 const and mongoose

'use strict';

const express = require('express');
const mime = require('mime');
const router = express.Router();
const mongoose = require('mongoose');
module.exports = router;

// retreives the entire item any time itemId is passed as a param
router.param('itemId', function (req, res, next, id) {
  mongoose.model('Item')
  .findById(id)
  .populate('things that are refrenced')
  .deepPopulate('refrence.refrences')
  .then(function (item) {
    if(!item) throw new Error('not found!');
    req.item = item;
    // for all gets with itemId we can use req.item now
    next();
  })
  .then(null, next);
});

// itemId turned to req.item above
router.get('/:itemId/subitem/:subitemId', function (req, res) {
  var songToSend;
  req.item.subitems.forEach(subitem => {
    if (subitem._id == req.params.subitemId) subitemToSend = subitem;
  });
  if (!subitemToSend) throw new Error('not found!');
  res.json(subitemToSend);
});

// Create
router.post('/', function (req, res, next) {
  mongoose.model('Playlist')
  .create(req.body)
  .then(function (playlist) {
    res.status(201).json(playlist);
  })
  .then(null, next);
});

// find array of all items
// Read
router.get('/', function (req, res, next) {
  mongoose.model('Item')
  .find(req.query)
  .then(function (item) {
    res.json(albums);
  })
  .then(null, next);
});

// Update
router.put('/:playlistId', function (req, res, next) {
  req.playlist.set(req.body);
  req.playlist.save()
  .then(function (playlist) {
    res.status(200).json(playlist);
  })
  .then(null, next);
});

// Delete
router.delete('/:playlistId', function (req, res, next) {
  req.playlist.remove()
  .then(function () {
    res.status(204).end();
  })
  .then(null, next);
});