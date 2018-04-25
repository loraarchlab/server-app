$(document).ready(function() {
  // create map instance
  let map = new BMap.Map("track-map");
  // create a central point
  const minDisplayLevel = 3;
  const maxDisplayLevel = 19;

  let $la_num = $('.la-num');
  let $lo_num = $('.lo-num');
  let $tr_num = $('.tr-num');
  let $fr_num = $('.fr-num');
  let $rs_num = $('.rs-num');
  let $sn_num = $('.sn-num');
  let $y_num = $('.y-num');
  let $x_num = $('.x-num');
  let $id_num = $('.id-num');
  let begin_num = parseInt($('#begin-num').text());
  let end_num = parseInt($('#end-num').text());

  let la_nums = $('.la-num').map(function() {
    return parseFloat($(this).text());
  });
  let x_nums = $('.x-num').map(function() {
    return parseFloat($(this).text());
  });
  let y_nums = $('.y-num').map(function() {
    return parseFloat($(this).text());
  });
  let id_nums = $('.id-num').map(function() {
    return parseInt($(this).text());
  });
  let tr_nums = $('.tr-num').map(function() {
    return $(this).text();
  });
  let fr_nums = $('.fr-num').map(function() {
    return parseInt($(this).text());
  });

  let infos = [];
  let points = [];
  let marker = [];

  for (let index = 0; index < la_nums.length; index++) {
    if (la_nums[index] != 0) {
      infos.push({tr: tr_nums[index], fr: fr_nums[index], id: id_nums[index]});
      points.push(new BMap.Point(y_nums[index], x_nums[index]));
    }
  }
 
  let setZoom = function(points) {
    const view = map.getViewport(points)
    map.centerAndZoom(view.center, view.zoom);
  }
  setZoom(points); 
  map.enableScrollWheelZoom(true);
  map.addControl(new BMap.NavigationControl());

  points.forEach(function(value, index) {
    marker[index] = new BMap.Marker(value);
    const infoWin = new BMap.InfoWindow('time: ' + infos[index].tr + '\ndevice id: '+ infos[index].id + ' count: ' + infos[index].fr,
                                        {enableMessage: false, width: 30, height: 20});
    marker[index].addEventListener("click", function() {
       this.openInfoWindow(infoWin);
    });
    map.addOverlay(marker[index]);
  });
  
  /*
  let showPath = function(startPoint, EndPoint) {
    let walking = new BMap.WalkingRoute(map, {
      renderOptions: {map: map, autoViewport: true},
      onPolylinesSet: function(routes) {
        let polyline = routes[0].getPolyline();
        polyline.disableMassClear();
        map.addOverlay(polyline);
      },
      onMarkersSet: function(routes) {
        map.removeOverlay(routes[0].marker);
        map.removeOverlay(routes[1].marker);
      },
    });
    walking.search(startPoint, EndPoint);
  };
  */

  let expandRoute = function(data) {
    const len = data.length;
    if (len < 2) {
      return;
    }
    const temp = data.slice(len - 2, len);
   
    const polyline = new BMap.Polyline(temp, {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
    polyline.disableMassClear();
    map.addOverlay(polyline);
   
    // showPath(temp[0], temp[1]);
    console.log("expandRoute");
  };

  // start ajax querying
  let updateRoute = function(data, index) {
    map.removeOverlay(marker[index]);
    marker[index] = new BMap.Marker(data);
    const infoWin = new BMap.InfoWindow('time: ' + infos[index].tr + '\ndevice id: '+ infos[index].id + ' count: ' + infos[index].fr,
                                        {enableMessage: false, width: 30, height: 20});
    marker[index].addEventListener("click", function() {
       this.openInfoWindow(infoWin);
    });

    map.addOverlay(marker[index]);
    
    const polyline = new BMap.Polyline([points[index], data], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
    map.addOverlay(polyline);

    points[index] = data;
    
    // expandRoute(point[device);
  };

  let updateLocation = function() {
    $.get("ajax/", function(data){
      data.record_list.forEach(function (value, index) {
        $la_num.eq(index).text(value.latitude);
        $lo_num.eq(index).text(value.longitude);
        $tr_num.eq(index).text(value.track_time);
        $fr_num.eq(index).text(value.frame_count);
        $rs_num.eq(index).text(value.rssi);
        $sn_num.eq(index).text(value.snri);
        $x_num.eq(index).text(value.co_x);
        $y_num.eq(index).text(value.co_y);
        $id_num.eq(index).text(value.device_id); 
        if (value.latitude != 0 && value.longitude != 0) {
          console.log("updaeRoute");
          infos[index] = {tr: value.track_time, fr: value.frame_count, id: value.device_id};
          updateRoute(new BMap.Point(value.co_y, value.co_x), index);
        }
      }); 
      setZoom(points);
    });
  };

  window.setInterval(updateLocation, 3000);

});
