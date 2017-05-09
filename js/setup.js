/** Notice the use of L.Map here. This is an extension of an organizational strategy we've already discussed. */
//Notice it is "app" that is created instead of "map"
var app = {
  apikey: "20556b93df8b47b3cf7d3086d906a6c37b3896af",
  map: L.map('map', { center: [41.876351, -87.633195], zoom: 12 }),
  geojsonClient: new cartodb.SQL({ user: 'silvia-fang', format: 'geojson' }), //format'json' will give you array or object
  drawnItems: new L.FeatureGroup()
};

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(app.map);

// Leaflet draw setup
app.map.addLayer(app.drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
app.map.addControl(
  new L.Control.Draw({
    edit: {
      featureGroup: app.drawnItems
    },
    draw: {
      rectangle: false,
      polyline: false,
      polygon: false,
      marker: true,
      circle: false
    }
  })
);

//Different zoom levels for Chicago Neighborhoods

var Loop = function () {
  app.map.setView([41.876867, -87.627748],15);
  console.log("Show Loop Extent");
  // $('h1.title').text(state.slideTitle[3]);
};

var riverNorth = function () {
  app.map.setView([41.893430, -87.633034],15);
  console.log("Show riverNorth Extent");
};

var chinaTown = function () {
  app.map.setView([41.851092, -87.635289],15);
  console.log("Show chinaTown Extent");
};

var lincolnPark = function () {
  app.map.setView([41.921746, -87.647657],15);
  console.log("Show lincolnPark Extent");
};

// Zoom changes on click
//Only zoom levels will change, not affecting the data shown

$('#Loop').on('click', function() {
  Loop();
});

$('#riverNorth').on('click', function() {
  riverNorth();
});

$('#chinaTown').on('click', function() {
  chinaTown();
});

$('#lincolnPark').on('click', function() {
  lincolnPark();
});

//Customize marker appearence, because cartocss cannot be used in this setup

var geojsonMarkerOptionsA = {
    radius: 4,
    stroke: 0.05,
    color: "#fff",
    fillColor: "#91cf60",
    opacity: 0.6,
    fillOpacity: 0.6
};

var geojsonMarkerOptionsB = {
    radius: 4,
    stroke: 0.05,
    color: "#fff",
    fillColor: "#ffffbf",
    opacity: 0.6,
    fillOpacity: 0.6
};

var geojsonMarkerOptionsC = {
    radius: 4,
    stroke: 0.05,
    color: "#fff",
    fillColor: "#fc8d59",
    opacity: 0.6,
    fillOpacity: 0.6
};
