$(document).ready(function() {
  // create map instance
  let map = new BMap.Map("track-map");
  // create a central point
  const minDisplayLevel = 3;
  const maxDisplayLevel = 19;

  let la_nums = $('.la-num').map(function() {
    return parseFloat($(this).text());
  });
  let lo_nums = $('.lo-num').map(function() {
    return parseFloat($(this).text());
  });
  let tr_nums = $('.tr-num').map(function() {
    return $(this).text();
  });
  let fr_nums = $('.fr-num').map(function() {
    return parseInt(($(this).text());
  });

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
  let translateCallback = function(data) {
    if (data.status === 0) {
      map.clearOverlays()
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

  let displayLocation = function() {
    $.get("ajax/", function(data){
      console.log(data);
      $la_num.text(data.latitude);
      $lo_num.text(data.longitude);
      $tr_num.text(data.track_time);
      $fr_num.text(data.frame_count);
      $rs_num.text(data.rssi);
      $sn_num.text(data.snr);
      if (data.latitude != 0 && data.longitude != 0) {
        convertor.translate([new BMap.Point(data.longitude, data.latitude)], 1, 5, translateCallback);
      }
    });
  };

  window.setTimeout(displayLocation, 5000);

});
