//Marker as origin, define global variable to store cordinates generated later in functions
var myMarker = [];
var myOrigin;
var orgLat;
var orgLng;
//Marker created on click
app.map.on('draw:created', function (e) {
  var type = e.layerType;
  var layer = e.layer;
  var id = L.stamp(layer); // The unique Leaflet ID for the layer
  console.log('draw created:', e.layer._latlng);
  // console.log(myMarker);
  if (myMarker[0]) {
        app.map.removeLayer(myMarker[0]); // remove the first rectangel drawn
        myMarker = [];
      }
  myMarker.push(layer);
  layer.addTo(app.map);

  var orgLatLng = function(obj){
    return Object.values(obj);
  };

console.log(orgLatLng(e.layer._latlng));

//populate the global variable with the cordinates
  orgLat = orgLatLng(e.layer._latlng)[0];
  orgLng = orgLatLng(e.layer._latlng)[1];
  myOrigin = [orgLat, orgLng];
  console.log(myOrigin);
  });

// The initial query by which we map the geojson representation of a table
//a way of talking to carto -- carto.js
var destLat;
var destLng;
var myDestination = [];

var layerCurrentRes; //this is to store current points shown on the map, in order to remove it later and ensure only one layer at a time is shown

//points are shown selevtively according to users' choice through clicking navbar links
var showPoints = function(where){
  app.geojsonClient.execute("SELECT * FROM food_inspection_prediction" + where) // 'LIMIT' should be added to the end of this line                                                    //filtering: WHERE cartodb_id>10
  .done(function(data) {
    console.log(data);
    layerCurrentRes = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
          destLat = e.target.getLatLng().lat;
          destLng = e.target.getLatLng().lng;
          myDestination = [destLat, destLng];
          console.log(myDestination);
          fillForm(feature.properties);
        });
      },
      //style and define interactive results while creating circlemarkers
      pointToLayer: function (feature, latlng) {
        if (feature.properties.probs < 0.5) {
          return L.circleMarker(latlng, geojsonMarkerOptionsA)
          .bindPopup("<ul><li>Name: "+feature.properties.aka_name+
                     "</li><li>Health Risk: "+String(math.round(feature.properties.probs*100,2).toString()+"%"))
          .on("mouseover", function(e){
            e.target.setStyle({radius: 6});
          })
          .on("mouseout", function(e){
            e.target.setStyle({radius: 4});
          });
        } else if (feature.properties.probs >= 0.5 && feature.properties.probs < 0.75) {
          return L.circleMarker(latlng, geojsonMarkerOptionsB)
          .bindPopup("<ul><li>Name: "+feature.properties.aka_name+
                     "</li><li>Health Risk: "+String(math.round(feature.properties.probs*100,2).toString()+"%"))
          .on("mouseover", function(e){
            e.target.setStyle({radius: 6});
          })
          .on("mouseout", function(e){
            e.target.setStyle({radius: 4});
          });
        } else if (feature.properties.probs >= 0.75) {
          return L.circleMarker(latlng, geojsonMarkerOptionsC)
          .bindPopup("<ul><li>Name: "+feature.properties.aka_name+
                     "</li><li>Health Risk: "+String(math.round(feature.properties.probs*100,2).toString()+"%"))
          .on("mouseover", function(e){
           e.target.setStyle({radius: 6});
          })
          .on("mouseout", function(e){
            e.target.setStyle({radius: 4});
          });
        }
    }
    })
    .addTo(app.map);
  })
  .error(function(errors) {
  });
};

//show all the points at first when opening the webpage
showPoints('');

// Automatically fill the form on the left from geojson response
var fillForm = function(properties) {
  $('#dest').val(properties.aka_name);
};

//Calculate Route
$("#calculate").click(function(e) {
  if (myOrigin === undefined) {
//When origin is not specified, make an alert to bring users' attention
    alert("Please specify your location using a marker!");
 } else {
//with origin and destination cordinates, calculate pedestrian route
   var route = 'https://matrix.mapzen.com/optimized_route?json={"locations":[{"lat":"'+orgLat+'","lon":"'+orgLng+'"},{"lat":"'+destLat+'","lon":"'+destLng+'"}],"costing":"pedestrian","directions_options":{"units":"miles"}}&api_key=mapzen-GqCg4GM';
   console.log(route);
   var calculate = $.ajax(route);
   console.log(calculate);
   calculate.done(function(getInfo) {
   console.log(getInfo);
     var str = getInfo.trip.legs[0].shape;
     var walkPath = decode(str);
     console.log(walkPath);
     var goRoute = L.polyline(walkPath, {
        color: 'blue'
      }).addTo(app.map);
   });
 }
});

$('#inspect').click(function(e){
  app.map.removeLayer(layerCurrentRes);
  showPoints(' WHERE probs >= 0.5');
});

$('#eat').click(function(e){
  app.map.removeLayer(layerCurrentRes);
  showPoints(' WHERE probs < 0.5');
});

$('#brand').click(function(e){
//  console.log(this);
  app.map.removeLayer(layerCurrentRes);
  showPoints('');
});

// $(document).ready(function(){
//     $("about").click(function(){
//         $("#myModal").modal('show');
//     });
// });

//I tried to you bootstrap modal but it doesn't work and no error was reported.
$('#about').click(function(e){
  alert("This Application provides health inspection prediction results in Chicago.\nThe prediction stems from previous year inspection results, distance to 311 complains, distance to burglary, etc.\n -Smart Foody Choice will show you all the restaurants with low risk (<50%) of failing an health inspection which means they are relatively safe;\n - Smart Inspection Choice is showing high risk restaurants. The Zoom dropdown will take you to different neighborhoods.\nIf you decide to go to one of these restaurants, please specify your origin with a marker, and your destination by clicking the restaurant point, and then click Go! button.");
});
