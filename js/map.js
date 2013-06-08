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

      var myLatLng = new google.maps.LatLng(place[2], place[3]);
      if(!rendered_markers[place[1]]){
        rendered_markers[place[1]] = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: image,
          shape: shape,
          title: place[1],
          animation: google.maps.Animation.DROP
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
