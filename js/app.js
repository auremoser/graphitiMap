(function(){
	// Global table and map style vars
    var userName = 'auremoser'
      , polygonTable = 'nynta'
      , polygonTableActiveCols = 'count_g, boroname, ntaname'
      , pointTable = 'graffiti_locations'
      , pointTableActiveCols = 'borough, status, incident_address_display'
      , defaultZoom = 10
      , markerWidth = 2
        // enable the pointSelected boolean if you have both a point and a polygon layer
        // if not, comment it out
      , pointSelected = false
        // What are your DOM canvas and hover box called?
      , mapCanvas = 'mapCanvas'
      , $mapCanvas = $('#mapCanvas')
      , $vlt = $('#pfx_volette')
      , $adrsInput = $('#pfx_inputBtn')
      , $adrsGo = $('#pfx_inputField')
        // make your map
      , map = new L.Map(mapCanvas).setView(new L.LatLng(40.73402305751195, -74.00871276855469), defaultZoom)
        // If you don't want Stamen Tiles, uncomment these next two lines and comment out the Stamen line
        // there's also a Stamen.js that you can comment out too
      , mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png'
      , layer = new L.TileLayer(mapboxUrl, {maxZoom: 18, attribution: "Powered by Leaflet and Mapbox"});
      //, layer = new L.StamenTileLayer("watercolor");

    map.addLayer(layer,true);
    // It's annoying when the scrollwheel zooms the map so disable it. Except when the map is 100% of the window
    map.scrollWheelZoom.disable();

    // Begin hover behavior functions
    var showPolygon = function(ev,latlng,pos,data){
      map.removeLayer(polygon);
            
      polygon = new L.GeoJSON(JSON.parse(data.geometry), {
        style: function (feature) {
          return polygon_style;
        }
      }).addTo(map);
      polygon.cartodb_id = data.cartodb_id;

    }

    var removePolygon = function(ev,latlng,pos,data){
      // Hide and remove in any case the hover polygon
      polygon.cartodb_id = null;
      polygon.off("featureparse");
      map.removeLayer(polygon)
    }

    var hideBox = function(){
       $vlt.hide();
    };

    // Then for the hover box
    var displayHoverInfo = function(tmpl, ev, latlng, pos, data){
      // _.extend(data, formatHelpers)
      var cnt = _.template(tmpl, data);
      $vlt.html(cnt).show();  
    };


    var hoverState = function(shape, ev, latlng, pos, data){
      if (shape == "polygon"){
        map.removeLayer(polygon);
        polygon = new L.GeoJSON(JSON.parse(data.geometry), {
          style: function (feature) {
            return polygon_style;
          }
        }).addTo(map);
        polygon.cartodb_id = data.cartodb_id;

        // Hover info
        $vlt.removeClass('pfx_darkScheme');
        var tmpl = $('#pfx_hoverTable0').html();
        displayHoverInfo(tmpl, ev, latlng, pos, data);
      }else{
        removePolygon();
        map.removeLayer(point);
        point = new L.GeoJSON(JSON.parse(data.geometry),{
          pointToLayer: function(feature,latlng) {
            return new L.CircleMarker(latlng, hover_style);
          }
        }).addTo(map);

        point.cartodb_id = data.cartodb_id;

        // Hover info
        $vlt.addClass('pfx_darkScheme');
        var tmpl = $('#pfx_hoverTable1').html();
        displayHoverInfo(tmpl, ev, latlng, pos, data);
      }
    } // End hover state functions


    // BEGIN MAP LAYERS

    // Polygon layer — States, table0
    var popup = new L.CartoDBPopup()
      // Initialize hover polygon
      , polygon = new L.GeoJSON(null)
      // Hover polygon style
      , polygon_style = {color: "#fff", weight: 2, opacity:1, fillOpacity: .45, fillColor:"#ffffff", clickable:false}
      , polygon_NOstyle = {color: "transparent", weight: 0, opacity:0, fillOpacity: .3, fillColor:"transparent", clickable:false}
      // Create the CartoDB layer
      , polyTable = new L.CartoDBLayer({
          map: map,
          user_name: userName,
          table_name: polygonTable,
          query: "SELECT cartodb_id," + polygonTableActiveCols + ",ST_SIMPLIFY(the_geom_webmercator,0.0001) as the_geom_webmercator,ST_ASGEOJSON(ST_SIMPLIFY(the_geom,0.002)) as geometry FROM {{table_name}} ",
          opacity: 1,
          interactivity: "cartodb_id," + polygonTableActiveCols + ",the_geom_webmercator,geometry",
          featureOver: function(ev,latlng,pos,data) {
            document.body.style.cursor = "pointer";
            // Show the hover polygon if it is a different feature
            if (data.cartodb_id != polygon.cartodb_id) {
              var shape = "polygon";
              if (pointSelected == false){
                hoverState(shape, ev, latlng, pos, data);
              }else{
                return
              }
            }
          },
          featureOut: function() {
            document.body.style.cursor = "default";
            removePolygon();
            hideBox();
          },
          featureClick: function(ev,latlng,pos,data) {
            // Stop propagation
            ev.stopPropagation();

          },
          auto_bound: false,
          debug: false
        });
 

    // Point Layer — Cities, table1
    var popup = new L.CartoDBPopup()
      // Initialize hover point
      , point = new L.GeoJSON(null)
      // Hover point style
      , hover_style = {radius:markerWidth, color:"#333", weight:1, opacity:1, fillColor: "#FFCC00", fillOpacity:1, clickable:false}
      // Create the CartoDB layer
      , ptTable = new L.CartoDBLayer({
          map: map,
          user_name: userName,
          table_name: pointTable,
          query: "SELECT cartodb_id," + pointTableActiveCols + ",the_geom_webmercator,ST_ASGEOJSON(the_geom) as geometry FROM {{table_name}} ",
          opacity: 1,
          interactivity: "cartodb_id," + pointTableActiveCols + ",geometry",
          featureOver: function(ev,latlng,pos,data) {
            // document.body.style.cursor = "pointer";
            pointSelected = true;

            // Show the hover point if it is a different feature
            if (data.cartodb_id != point.cartodb_id) {
               var shape = "point";
               hoverState(shape, ev, latlng, pos, data);
            }
            $vlt.show();
          },
          featureOut: function() {
            document.body.style.cursor = "default";
            pointSelected = false;
            // Hide and remove in any case the hover point
            // $('#pfx_volette').removeClass('pfx_darkScheme');
            point.cartodb_id = null;
            map.removeLayer(point)
          },
          featureClick: function(ev,latlng,pos,data) {
            // Stop propagation
            ev.stopPropagation();

          },
          auto_bound: false,
          debug: false
    });

    // If the mouse leaves the map canvas, hide the highlighted polygon
    // and the hover box
    $mapCanvas.mouseleave(function(){    
      removePolygon();
      hideBox();
    });

    // Same thing if it leaves the window
    $(window).mouseleave(function(){    
      removePolygon();  
      hideBox();
    });
      
    // Adding the layers to map
    map.addLayer(polyTable);
    map.addLayer(ptTable);
    ptTable.hide();
    $('#cartodb_logo').css('bottom','18px');
    $('.leaflet-control-attribution').html('Powered by <a href="http://leaflet.cloudmade.com/">Leaflet</a>, CartoDB, Stamen Design, ColorBrewer')

    // Layer toggling options
    $('.pfx_radioBox input').click(function(){
      var displayVar = $(this).val();
      if (displayVar == 'all'){
        polyTable.show();
        ptTable.show();
      }else if (displayVar == 'nta'){
        polyTable.show();
        ptTable.hide();
      }else{
        polyTable.hide();
        ptTable.show();
      }
    });

    // BEGIN GEOCODING
    var geocoder
      , firstRun = true
      , markerGroup;
    geocoder = new google.maps.Geocoder();
    var geoCode = function(address){
      geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat()
            , lng = results[0].geometry.location.lng()
            , latLng = new L.LatLng(lat, lng);
            map.panTo(latLng);
            // Set the zoom to whatever you want.
            // the higher the number the greater the zoom.
            map.setZoom(12);
            
            // Optional, place a marker
            if (firstRun == false){
              map.removeLayer(markerGroup)
            }

            var marker = L.marker([lat, lng]);
            markerGroup = L.layerGroup([marker]);
            map.addLayer(markerGroup);
            firstRun = false;
        
          } else {
            //console.log('Geocder fail: ' + status)
          }
        });
    }
    // Geocoding buttons
    $adrsInput.click(function(){
      var addrs = $adrsGo.val();
      geoCode(addrs);
    });
    // also enable the button when you hit return
    $(document).keydown(function(e) {
      if (e.keyCode==13) { // return key
          $adrsInput.trigger('click');
        }
    }); // End geocoding


})();