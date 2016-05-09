'use strict';

// server run command || supervisor -- --harmony_destructuring app.js

var express = require('express')
  , http = require('http')
  , path = require('path')
  , reload = require('reload')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  // , fetch = require('node-fetch')
  , fs = require('fs')
  , request = require('request')

const Firebase = require('firebase')
const firebase = new Firebase('https://gmres--ridotcom.firebaseio.com/')

var _ = require('lodash')

const pFlagIndex = process.argv.indexOf('-p')

const app = express()
const port = (pFlagIndex !== -1 ) ? process.argv[pFlagIndex + 1] : 1337

const publicDir = path.join(__dirname, '')

app.set('port', process.env.PORT || port)
app.use(logger('dev'))
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded
app.use('/js/', express.static('prod/js/'))
app.use('/css/', express.static('prod/css/'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/prod/index.html'));
})

app.get('/*.serviceworker.js', function(req, res) {
  res.sendFile(path.join(__dirname + `/prod${req.originalUrl}`));
})

app.get('/*.html', function(req, res) {
  res.sendFile(path.join(__dirname + `/prod${req.originalUrl}`));
})

const data = firebase.child('data').child('places').once('value').then((snap) => snap.val())
  .then((data) => {
    return _.map(data, (item) => item)
  })

app.get('/data/', (req, res) => {
  data.then((data) => res.json(data))
})

var server = http.createServer(app)

reload(server, app)

server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});
