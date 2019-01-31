var express = require('express')
var app = express()
const axios = require('axios');
var cors = require('cors');


const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyC48nPNoUEt9PuHq3IAOSfUZ-SPjbKksMk',
  Promise: Promise
});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(cors());


app.get('/', function (request, response) {
  response.send('Hello World!')
})

app.get('/map/:lat/:long', (req, res) => {
  let ids = [];
  let places = [];
  googleMapsClient.placesNearby({ "location": [req.params.lat, req.params.long], "radius": 1800, "type": "restaurant" })
    .asPromise()
    .then((response) => {
      const { results } = response.json;
      res.send(results);
      results.map((result) => {
        ids.push(result.place_id);
      })
      // res.send(ids);
      // getPlaces(ids);
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

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
