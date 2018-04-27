$(document).ready(function() {
  // create map instance
  let map = new BMap.Map("track-map");
  // create a central point
  const minDisplayLevel = 3;
  const maxDisplayLevel = 19;

  let x_nums = $('.x-num').map(function() {
    return parseFloat($(this).text());
  });
  let y_nums = $('.y-num').map(function() {
    return parseFloat($(this).text());
  });
  let la_nums = $('.la-num').map(function() {
    return parseFloat($(this).text());
  });  
  let tr_nums = $('.tr-num').map(function() {
    return $(this).text();
  });
  let fr_nums = $('.fr-num').map(function() {
    return parseInt($(this).text());
  });
  let id_nums = $('.id-num').map(function() {
    return parseInt($(this).text());
  });
  let rs_nums = $('.rs-num').map(function() {
    return parseInt($(this).text());
  });
  let sn_nums = $('.sn-num').map(function() {
    return parseFloat($(this).text());
  });
  let $di_num = $('.di-num');
  let di_nums = [];

  let setZoom = function(points) {
    console.log('setZoom');
    const view = map.getViewport(points)
    map.centerAndZoom(view.center, view.zoom);
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl());
  };

  let setDistance = function(points) {
    const gwPoint = new BMap.Point(116.340213, 40.007113);
    points.forEach(function(value, index) {
      const distan = map.getDistance(gwPoint, value).toFixed(2);
      $di_num.eq(index).text(distan);
      di_nums.push(distan);
    });
  };

  let showPath = function(startPoint, EndPoint) {
    let walking = new BMap.WalkingRoute(map, { 
      renderOptions: {map: map, autoViewport: true},
      onPolylinesSet: function(routes) {
        map.addOverlay(routes[0].getPolyline());
      },
      onMarkersSet: function(routes) {
        map.removeOverlay(routes[0].marker);
        map.removeOverlay(routes[1].marker);
      },
    });
    walking.search(startPoint, EndPoint);
    /*    
    walking.setSearchCompleteCallback(function (rs) {
      const pts = walking.getResults().getPlan(0).getRoute(0).getPath();
      map.addOverlay(new BMap.Polyline(pts, { strokeColor: "green", strokeWeight: 2, strokeOpacity: 1 }));
    });
    */
  };

  let info = [];
  let point = [];
  let points = [];
  let exist = {};

  let displayLocation = function() {
    let cat = 0;
    for (let index = 0; index < la_nums.length; index++) {
      points.push(new BMap.Point(y_nums[index], x_nums[index]));
    }
    setDistance(points);

    for (let index = 0; index < la_nums.length; index++) {
      if (la_nums[index] != 0) {
        const dev_id = id_nums[index];
        if (exist[dev_id] === undefined) {
          exist[dev_id] = cat;
          info[cat] = [];
          point[cat] = [];
          cat++;
        }
        info[exist[dev_id]].push({tr: tr_nums[index], fr: fr_nums[index], 
                                  id: dev_id, rs: rs_nums[index], sn: sn_nums[index], 
                                  cox: x_nums[index].toFixed(6), coy: y_nums[index].toFixed(6), di: di_nums[index]});
        point[exist[dev_id]].push(new BMap.Point(y_nums[index], x_nums[index]));
      } else {
        points.splice(index, 1);
      }
    }

    setZoom(points);
    point.forEach(function(value, index) {
      const polyline = new BMap.Polyline(value, {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
      map.addOverlay(polyline);
      value.forEach(function(value1, index1) { 
        let marker = new BMap.Marker(value1);
        const infoWin = new BMap.InfoWindow('time: ' + info[index][index1].tr + '<br/>device id: '+ info[index][index1].id + ' count: ' + info[index][index1].fr + 
                                            '<br/>rssi: ' + info[index][index1].rs + ' snr: ' + info[index][index1].sn + '<br/>co_x: ' + info[index][index1].cox +
                                            '<br/>co_y: ' + info[index][index1].coy + '<br/>distance: ' + info[index][index1].di + 'm', 
                                            {enableMessage: false, width: 30, height: 150});
        marker.addEventListener("click", function() {
          this.openInfoWindow(infoWin);
        });
        map.addOverlay(marker);
      });
    });
    /*
    for (let index = 0; index < points.length - 1; index++) {
      showPath(points[index], points[index + 1]);
    }
    */
    /*
    points.forEach(function(value, index) {
      let marker = new BMap.Marker(value);
      const infoWin = new BMap.InfoWindow('time: ' + infos[index].tr + '\ndevice id: '+ infos[index].id + ' count: ' + infos[index].fr,
                                          {enableMessage: false, width: 30, height: 20});
      marker.addEventListener("click", function() {
        this.openInfoWindow(infoWin);
      });
      map.addOverlay(marker);
      // console.log(index);
    });
    */
  };

  window.setTimeout(displayLocation, 5000);

});
