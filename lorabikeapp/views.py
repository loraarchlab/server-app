from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone

from lorabikeapp.models import Location
from lorabikeapp.utils import wgs84_to_bd09

import json
import base64
import struct
from datetime import datetime

# Create your views here.

def uplink(request):
  if request.method == 'POST':
    received_json = json.loads(request.body.decode('utf-8'))
    # print(received_json)
    received_payload = received_json['data']
    re = struct.unpack('IIdd', base64.b64decode(received_payload))
    received_snr = received_json['rxInfo'][0]['loRaSNR']
    received_rssi = received_json['rxInfo'][0]['rssi']
    received_fnt = received_json['fCnt']
    # received_id = re[0]
    received_co_y, received_co_x = wgs84_to_bd09(re[3], re[2])
    # print(re)
    Location.objects.create(device_id = re[0], frame_count = received_fnt,
                            latitude = re[2], longitude = re[3], co_x = received_co_x,
                            co_y = received_co_y, snr = received_snr, rssi = received_rssi)
    return HttpResponse("Get the post data.")

    
def uplink_mock(request):
  if request.method == 'POST':
    received_json = json.loads(request.body.decode('utf-8'))
    # print(received_json)
    received_id = received_json['id']
    received_snr = received_json['snr']
    received_rssi = received_json['rssi']
    received_fnt = received_json['fnt']
    received_la = received_json['la']
    received_lo = received_json['lo']
    received_coy, received_cox = wgs84_to_bd09(received_lo, received_la)
    # received_id = re[0]
    # received_co_y, received_co_x = wgs84_to_bd09(re[3], re[2])
    # print(re)
    Location.objects.create(device_id = received_id, frame_count = received_fnt,
                            latitude = received_la, longitude = received_lo, co_x = received_cox,
                            co_y = received_coy, snr = received_snr, rssi = received_rssi)
    return HttpResponse("Get the post data.")

def get_dict_from_record(location):    
  if location:
    context = {'device_id': location.device_id,
               'latitude': location.latitude,
               'longitude': location.longitude,
               'co_x': location.co_x,
               'co_y': location.co_y,
               'track_time': timezone.localtime(location.track_time).strftime("%Y-%m-%d %H:%M:%S"),
               'frame_count': location.frame_count,
               'snr': location.snr,
               'rssi': location.rssi}
  else:
    context = {'device_id': 0,
               'latitude': 0,
               'longitude': 0,
               'co_x': 0,
               'co_y': 0,
               'track_time': "0",
               'frame_count': 0,
               'snr': 0,
               'rssi': 0}
  return context

def get_str_from_record(location):
  pattern = 'id: %u, track_time: %s, frame_count: %u, latitude: %f, longitude: %f, snr: %f, rssi: %d'
  context = (location.id, location.track_time.strftime("%Y-%m-%d %H:%M:%S"), location.frame_count,
             location.latitude, location.longitude, location.snr, location.rssi)
  return pattern % context
 
  
def livemap(request, begin_id, end_id):
  if request.method == 'GET':
    # get the latest bike location
    context = []
    for dev_id in range(begin_id, end_id + 1):
      locations = Location.objects.filter(device_id=dev_id).order_by('-id')
      if locations:
        context.append(get_dict_from_record(locations[0]))
      else:
        context.append(get_dict_from_record(None))
    return render(request, 'livemap.html', {'record_list': context})

def livemap_ajax(request, begin_id, end_id):
  if request.method == 'GET':
    # get the latest bike location
    context = []
    for dev_id in range(begin_id, end_id + 1):
      locations = Location.objects.filter(device_id=dev_id).order_by('-id')
      if locations:
        context.append(get_dict_from_record(locations[0]))
      else:
        context.append(get_dict_from_record(None)) 
    return JsonResponse({'record_list': context})

def datarecord(request, begin_time, end_time, begin_id, end_id):
  if request.method == 'GET':
    begin_datetime = datetime.strptime(begin_time, '%Y-%m-%d-%H-%M-%S')
    end_datetime = datetime.strptime(end_time, '%Y-%m-%d-%H-%M-%S')
    locations = Location.objects.filter(track_time__range=(begin_datetime, end_datetime)).filter(device_id__range=(begin_id, end_id)).order_by('-id')
    record_list = []
    for location in locations:
      record = get_dict_from_record(location)
      record_list.append(record)
    return render(request, 'datarecord.html', {'record_list': record_list})
    
