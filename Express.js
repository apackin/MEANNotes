

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


// router.js using es6 const

'use strict';

const express = require('express');
const mime = require('mime');
const router = express.Router();
const mongoose = require('mongoose');
module.exports = router;

router.get('/', function (req, res, next) {
  mongoose.model('Album')
  .find(req.query)
  .then(function (albums) {
    res.json(albums);
  })
  .then(null, next);
});

router.param('albumId', function (req, res, next, id) {
  mongoose.model('Album')
  .findById(id)
  .populate('artists songs')
  .deepPopulate('songs.artists')
  .then(function (album) {
    if(!album) throw new Error('not found!');
    req.album = album;
    next();
  })
  .then(null, next);
});

router.get('/:albumId.image', function (req, res, next) {
  mongoose.model('Album')
  .findById(req.params.albumId)
  .select('+cover +coverType')
  .then(function (album) {
    if(!album.cover || !album.coverType) return next(new Error('no cover'));
    res.set('Content-Type', mime.lookup(album.coverType));
    res.send(album.cover);
  })
  .then(null, next);
});

router.get('/:albumId', function (req, res) {
  res.json(req.album);
});

router.get('/:albumId/songs/', function (req, res) {
  res.json(req.album.songs);
});

router.get('/:albumId/songs/:songId', function (req, res) {
  var songToSend;
  req.album.songs.forEach(song => {
    if (song._id == req.params.songId) songToSend = song;
  });
  if (!songToSend) throw new Error('not found!');
  res.json(songToSend);
});