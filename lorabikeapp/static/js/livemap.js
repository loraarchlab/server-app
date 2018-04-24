$(document).ready(function() {
  // create map instance
  let map = new BMap.Map("track-map");
  // create a central point
  const minDisplayLevel = 3;
  const maxDisplayLevel = 19;
  let $la_num = $('#la-num');
  let $lo_num = $('#lo-num');
  let $tr_num = $('#tr-num');
  let $fr_num = $('#fr-num');
  let $rs_num = $('#rs-num');
  let $sn_num = $('#sn-num');
  let $y_num = $('#y-num');
  let $x_num = $('#x-num');
  const centralX = parseFloat($la_num.text());
  const centralY = parseFloat($lo_num.text());
  const centralPoint = new BMap.Point(centralY, centralX);
  let convertor = new BMap.Convertor();
  // initialize map with central point
  map.centerAndZoom(centralPoint, maxDisplayLevel);
  map.enableScrollWheelZoom(true);
  map.addControl(new BMap.NavigationControl());
  
  let points = [];
  
  /*
  let setZoom = function(points) {
    console.log('setZoom');
    const view = map.getViewport(eval(points));
    map.centerAndZoom(view.centor, view.zoom);
  }
  */
  let expandRoute = function(data) {
    const len = data.length;
    if (len < 2) {
      return;
    }
    const temp = data.slice(len - 2, len);
    const polyline = new BMap.Polyline(temp, {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});
    polyline.disableMassClear();
    map.addOverlay(polyline);
    console.log("expandRoute");
  }

  // start ajax querying
  let updateRoute = function(data) {
    if (data.status === 0) {
      map.clearOverlays();
      const marker = new BMap.Marker(data.points[0]);
      map.addOverlay(marker);
      // const label = new BMap.Label("LoRaBike",{offset:new BMap.Size(20,-10)});
      // marker.setLabel(label);
      map.setCenter(data.points[0]);
      points.push(data.points[0]);
      expandRoute(points);
      // setZoom(points);
    }
  };

  let updateLocation = function() {
    $.get("ajax/", function(data){
      console.log(data);
      $la_num.text(data.latitude);
      $lo_num.text(data.longitude);
      $tr_num.text(data.track_time);
      $fr_num.text(data.frame_count);
      $rs_num.text(data.rssi);
      $sn_num.text(data.snri);
      $x_num.text(data.co_x);
      $y_num.text(data.co_y);
      if (data.latitude != 0 && data.longitude != 0) {
        updateRoute(new BMap.Point(data.co_y, data.co_x));
      }
    });
  };

  window.setInterval(updateLocation, 5000);

});
