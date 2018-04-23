from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from lorabikeapp.models import Location

import json
import base64
import struct
import datetime

# Create your views here.

def uplink(request):
  if request.method == 'POST':
    received_json = json.loads(request.body.decode('utf-8'))
    print(received_json)
    received_payload = received_json['data']
    re = struct.unpack('IIdd', base64.b64decode(received_payload))
    received_snr = received_json['rxInfo'][0]['loRaSNR']
    received_rssi = received_json['rxInfo'][0]['rssi']
    received_fnt = received_json['fCnt']
    # if not re[2] and not re[3]:
    print(re)
    Location.objects.create(track_time = datetime.datetime.now(), frame_count = received_fnt,
                              latitude = re[2], longitude = re[3], snr = received_snr, 
                              rssi = received_rssi)
    return HttpResponse("Get the post data.")
    
def get_dict_from_record(location):    
  if location:
    context = {'latitude': location.latitude,
               'longitude': location.longitude,
               'track_time': location.track_time.strftime("%Y-%m-%d %H:%I:%S"),
               'frame_count': location.frame_count,
               'snr': location.snr,
               'rssi': location.rssi}
  else:
    context = {'latitude': 0,
               'longitude': 0,
               'track_time': "0",
               'frame_count': 0,
               'snr': 0,
               'rssi': 0}
  return context

def get_str_from_record(location):
  pattern = 'id: %u, track_time: %s, frame_count: %u, latitude: %f, longitude: %f, snr: %f, rssi: %d'
  context = (location.id, location.track_time.strftime("%Y-%m-%d %H:%I:%S"), location.frame_count,
             location.latitude, location.longitude, location.snr, location.rssi)
  return pattern % context
 
  
def livemap(request):
  if request.method == 'GET':
    # get the latest bike location
    locations = Location.objects.order_by('-id')
    if locations:
      context = get_dict_from_record(locations[0])
    else:
      context = get_dict_from_record(None)
    return render(request, 'livemap.html', context)

def livemap_ajax(request):
  if request.method == 'GET':
    # get the latest bike location
    locations = Location.objects.order_by('-id')
    if locations:
      context = get_dict_from_record(locations[0])
    else:
      context = get_dict_from_record(None)
    return JsonResponse(context)

def datarecord(request, record_num):
  if request.method == 'GET':
    locations = Location.objects.order_by('-id')[:record_num]
    record_list = []
    for location in locations:
      record = get_dict_from_record(location)
      record_list.append(record)
    return render(request, 'datarecord.html', {'record_list': record_list})
    
