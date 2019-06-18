var express = require('express');
var app = express();
const axios = require('axios');
var cors = require('cors');
var http = require('http');
const JSON = require('circular-json');

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCm_boaMdggWKCv5MSJPdM3xTnGiuq_5zg',
  Promise: Promise
});

app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));
app.use(cors());

setInterval(function() {
  http.get('http://yao-backend.herokuapp.com');
  console.log('pinging...');
}, 18000);

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/map/:lat/:long', (req, res) => {
  let ids = [];
  let places = [];
  googleMapsClient
    .placesNearby({
      location: [req.params.lat, req.params.long],
      radius: 1800,
      type: 'cafe'
    })
    .asPromise()
    .then(response => {
      const { results } = response.json;
      res.send(results);
    })
    .catch(err => {
      console.log(err);
    });

  function getPlaces(placeList) {
    placeList.map(place_l => {
      googleMapsClient
        .place({ placeid: place_l })
        .asPromise()
        .then(response => {
          const { results } = response.json;
          res.send(results);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
});

app.get('/search/:search', (req, res) => {
  googleMapsClient
    .geocode({ address: req.params.search })
    .asPromise()
    .then(response => {
      res.send(response.json.results[0].geometry.location);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/places/:lat/:long', (req, res) => {
  res.send(`Lat: ${req.params.lat} Long ${req.params.long}`);
});

app.get('/spottedbylocals', (req, res) => {
  axios
    .get(
      'http://api.spottedbylocals.com/getlatestblogsfromcity/?city_id=1&key=jfljfo138021'
    )
    .then(function(response) {
      // handle success
      const json = JSON.stringify(response);
      res.send(json);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    });
});

app.get('/foursqaure/places/:lat/:long', (req, res) => {
  axios
    .get(
      `https://api.foursquare.com/v2/venues/explore?client_id=1DHVNT5QG4YE1OLDDST3IXTWZWZ5WSZ1VOCDZBXLEFLQWXER&client_secret=CE4JOEELFV4HZ1TWWUSSFZQXNGHJNCOGMM2SPCAE14E5YWPV&v=20190911&section=food&intent=checkin&radius=200&&ll=${
        req.params.lat
      },${req.params.long}`
    )
    .then(respsonse => {
      console.log(respsonse.data.response.venues);
      res.send(respsonse.data.respsonse.groups[0].items);
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
