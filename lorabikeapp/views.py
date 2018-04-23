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
    # print(re)
    # print(type(re[1]))
    Location.objects.create(track_time = datetime.datetime.now(),
                            latitude = re[2], longitude = re[3], frame_count = re[1])
    return HttpResponse("Get the post data.")
    

def livemap(request):
  if request.method == 'GET':
    # get the latest bike location
    location = Location.objects.order_by('-id')[0]
    context = {'latitude': location.latitude, 'longitude': location.longitude}
    return render(request, 'livemap.html', context)

def livemap_ajax(request):
  if request.method == 'GET':
    # get the latest bike location
    location = Location.objects.order_by('-id')[0]
    context = {'latitude': location.latitude, 'longitude': location.longitude}
    return JsonResponse(context)
