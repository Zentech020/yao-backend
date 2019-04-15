var express = require('express')
var app = express()
const axios = require('axios');
var cors = require('cors');
var http = require('http');


const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCm_boaMdggWKCv5MSJPdM3xTnGiuq_5zg',
  Promise: Promise
});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(cors());


setInterval(function () {
  http.get("http://yao-backend.herokuapp.com");
  console.log('pinging...');
}, 18000);

app.get('/', function (request, response) {
  response.send('Hello World!')
})

app.get('/map/:lat/:long', (req, res) => {
  let ids = [];
  let places = [];
  googleMapsClient.placesNearby({ "location": [req.params.lat, req.params.long], "radius": 1800, "type": "cafe" })
    .asPromise()
    .then((response) => {
      const { results } = response.json;
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
    });

  function getPlaces(placeList) {
    placeList.map((place_l) => {
      googleMapsClient.place({ "placeid": place_l })
        .asPromise()
        .then((response) => {
          const { results } = response.json;
          res.send(results);
        })
        .catch((err) => {
          console.log(err);
        })
    })
  }
})

app.get('/search/:search', (req, res) => {
  googleMapsClient.geocode({ address: req.params.search })
    .asPromise()
    .then((response) => {
      res.send(response.json.results[0].geometry.location);
    })
    .catch((err) => {
      console.log(err);
    });
})

app.get('/places/:lat/:long', (req, res) => {
  res.send(`Lat: ${req.params.lat} Long ${req.params.long}`)
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
