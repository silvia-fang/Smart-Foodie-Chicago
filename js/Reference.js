$('#brand').on('click', function() {
  All();
});

//setting up the view
var eat = app.geojsonClient.execute("SELECT * FROM food_inspection_prediction WHERE probs <0.5") // 'LIMIT' should be added to the end of this line                                                    //filtering: WHERE cartodb_id>10
  .done(function(data) {
    console.log(data);
    L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
          // fillForm(feature.properties);
          destLat = e.target.getLatLng().lat;
          destLng = e.target.getLatLng().lng;
          myDestination = [destLat, destLng];
          console.log(myDestination);
        });
      },
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptionsA);
    }
    })
    .addTo(app.map);
  })
  .error(function(errors) {
  });

//Changing views
  $('#inspect').on('click', function() {
    inspect();
  });


  var inspect = app.geojsonClient.execute("SELECT * FROM food_inspection_prediction WHERE probs >=0.5") // 'LIMIT' should be added to the end of this line                                                    //filtering: WHERE cartodb_id>10
    .done(function(data) {
      console.log(data);
      L.geoJson(data, {
        onEachFeature: function(feature, layer) {
          layer.on('click', function(e) {
            // fillForm(feature.properties);
            destLat = e.target.getLatLng().lat;
            destLng = e.target.getLatLng().lng;
            myDestination = [destLat, destLng];
            console.log(myDestination);
          });
        },
        pointToLayer: function (feature, latlng) {
          if (feature.properties.probs < 0.5) {
            return L.circleMarker(latlng, geojsonMarkerOptionsA);
          } else if (feature.properties.probs >= 0.5 && feature.properties.probs < 0.75) {
            return L.circleMarker(latlng, geojsonMarkerOptionsB);
          } else if (feature.properties.probs >= 0.75) {
            return L.circleMarker(latlng, geojsonMarkerOptionsC);
          }
      }
      })
      .addTo(app.map);
    })
    .error(function(errors) {
    });

  //Changing views
    $('#eat').on('click', function() {
      eat();
    });

    if (myMap[0]) {
          app.map.removeLayer(myMap[0]); // remove the first rectangel drawn
          myMap = [];
          myMap.push(layer);
        }

  var mySearch = $.ajax('https://search.mapzen.com/v1/search?api_key=mapzen-GqCg4GM&text=' + '#dest' + '& boundary.country=USA');
  console.log(mySearch);
        //      originCord = geoInfo.features[0].geometry.coordinates;
        //      orgLon = geoInfo.features[0].geometry.coordinates[0];
        //      orgLat = geoInfo.features[0].geometry.coordinates[1];
        // });

//cartodb
  SELECT cartodb_id, the_geom_webmercator, probs,risk, aka_name FROM food_inspection_prediction WHERE probs >=0.5


  +
  "</li><li>Inspection Priority: "+sss+"</li></ul>"



    <!-- Sidebar -->
      <!-- <div class="sidebar">
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <h1>Smart Health Inspection</h1>
              <div class="input-group">
                <input id="name" type="text"
                       class="form-control"
                       placeholder="name"
                       disabled>
                <input id="cartodb_id" type="number"
                       class="form-control"
                       placeholder="cartodb_id"
                       disabled>
              </div>
              <h1>Generating Routes</h1>
                <label for="dest">Destination </label>
                <input id="dest" type="text">
                <button id="calculate">Calculate Route</button>
            </div>
          </div>
        </nav>
        <div class="container-fluid">
          <ul id="project-list" class="list-group">
          </ul>
        </div>
      </div> -->
