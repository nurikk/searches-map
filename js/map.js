(function(){
  var map,
    rendered_markers = {},
    zoom = 4,
    center = new google.maps.LatLng(55.790833, 49.114444),
    refresh_timeout = 5000; //ms

  function setMarkers(map, locations){
    var image = {
      url: 'images/airplane.png',
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 32)
    };

    var shape = {
      coord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
    };

    _.each(rendered_markers, function(marker, idx, markers){
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        marker.setMap(null);
        delete markers[idx];
      }, 2000);
    });

    _.each(locations, function(place){

      var searches = place[0],
        name = place[1],
        lat = place[2],
        long = place[3];

      if(!lat || !long){
        return;
      }
      var myLatLng = new google.maps.LatLng(lat, long);
      if(!rendered_markers[name]){
        rendered_markers[name] = new MarkerWithLabel({
          position: myLatLng,
          map: map,
          labelContent: name + ' (' + searches + ')',
          icon: image,
          shape: shape,
          labelClass: "labels", // the CSS class for the label
          labelStyle: {opacity: 0.75},
          labelAnchor: new google.maps.Point(-32, 25),
          title: name
        });
      }
    });
  }

  function initialize(){
    var mapOptions = {
      center: center,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    load_data();
  }

  function load_data(){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'proxy.php',
      success: function(search_places){
        setMarkers(map, search_places);
        setTimeout(load_data, refresh_timeout);
      },
      error: load_data
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);
})();
