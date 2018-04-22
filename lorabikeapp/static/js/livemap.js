$(document).ready(function() {
  // create map instance
  let map = new BMap.Map("track-map");
  // create a point
  const minDisplayLevel = 3;
  const maxDisplayLevel = 19;
  let $la_num = $('#la-num');
  let $lo_num = $('#lo-num');
  const centralX = parseFloat($la_num.text()).toFixed(6);
  const centralY = parseFloat($lo_num.text()).toFixed(6);
  const centralPoint = new BMap.Point(centralY, centralX);
  // initialize map with central point
  map.centerAndZoom(centralPoint, maxDisplayLevel);
  map.enableScrollWheelZoom(true);
  // add marker to central point
  const centralMarker = new BMap.Marker(centralPoint);
  map.addOverlay(centralMarker);
  // start ajax querying
  // window.setInterval(updatePoints, 1000);
  let updateLocation = function() {
    let pointsData = null;
    $.get("ajax/", function(data){
      $la_num.text(data.latitude);
      $lo_num.text(data.longitude);
    });
  };
  window.setInterval(updateLocation, 1000);
});
