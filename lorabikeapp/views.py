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
    Location.objects.create(track_time = datetime.datetime.now(), frame_count = received_fnt,
                              latitude = re[2], longitude = re[3], snr = received_snr, 
                              rssi = received_rssi)
    return HttpResponse("Get the post data.")
    

def livemap(request):
  if request.method == 'GET':
    # get the latest bike location
    locations = Location.objects.order_by('-id')
    if locations:
      context = {'latitude': locations[0].latitude, 
                 'longitude': locations[0].longitude,
                 'track_time': locations[0].track_time.strftime("%Y-%m-%d %H:%I:%S"),
                 'frame_count': locations[0].frame_count,
                 'snr': locations[0].snr,
                 'rssi': locations[0].rssi}
    else:
      context = {'latitude': 0,
                 'longitude': 0,
                 'track_time': "0",
                 'frame_count': 0,
                 'snr': 0,
                 'rssi': 0}
    return render(request, 'livemap.html', context)

def livemap_ajax(request):
  if request.method == 'GET':
    # get the latest bike location
    locations = Location.objects.order_by('-id')
    if locations:
      context = {'latitude': locations[0].latitude,
                 'longitude': locations[0].longitude,
                 'track_time': locations[0].track_time.strftime("%Y-%m-%d %H:%I:%S"),
                 'frame_count': locations[0].frame_count,
                 'snr': locations[0].snr,
                 'rssi': locations[0].rssi}
    else:
      context = {'latitude': 0,
                 'longitude': 0,
                 'track_time': "0",
                 'frame_count': 0,
                 'snr': 0,
                 'rssi': 0}
    return JsonResponse(context)
