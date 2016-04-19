(function () {
  'use strict';
  
  var layer = new L.StamenTileLayer('toner');
  
  var map = new L.Map('map', {
    center: new L.LatLng(65, 25),
    zoom: 5
  });
  map.addLayer(layer);
  
  var socket = io();
  
  socket.on('area:scanned', function(data){
    L.rectangle([
      [data.ne.lat, data.ne.lng],
      [data.sw.lat, data.sw.lng]
    ], {color: '#ff7800', weight: 1}).addTo(map);
  });
  
  socket.on('venue:found', function(data){
   var marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
   marker.bindPopup(data.name);
  });
  
  $('#scanBtn').click(function () {
    var ne = {
      lat: parseInt($('#ne-lat').val(), 10),
      lng: parseInt($('#ne-lng').val(), 10)
    };
    var sw = {
      lat: parseInt($('#sw-lat').val(), 10),
      lng: parseInt($('#sw-lng').val(), 10)
    };
    socket.emit('start:scan', {ne: ne, sw: sw});
  });

})();