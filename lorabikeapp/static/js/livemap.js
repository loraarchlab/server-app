$(document).ready(function() {
  // create map instance
  let map = new BMap.Map("track-map");
  // create a point
  const minDisplayLevel = 3;
  const maxDisplayLevel = 19;
  const centralX = parseFloat($('#la-num').text()).toFixed(6);
  const centralY = parseFloat($('#lo-num').text()).toFixed(6);
  const centralPoint = new BMap.Point(centralY, centralX);
  // initialize map with central point
  map.centerAndZoom(centralPoint, maxDisplayLevel);
  map.enableScrollWheelZoom(true);
  // add marker to central point
  const centralMarker = new BMap.Marker(centralPoint);
  map.addOverlay(centralMarker);
  // start ajax querying
  /*
  window.setInterval(updatePoints, 1000);
  let updatePoints = function() {
    let pointsData = null;
    $.ajax("ajax-data-json")
      .done(function() {
        alert("success");
      })
      .fail(function() {
        alert("error");
      })
      .always(function() {
        alert("complete");
      });
    console.log("update Points end");
  }
  */
});
