from django.shortcuts import render
from django.http import HttpResponse

import json
import base64
import struct

# Create your views here.

def uplink(request):
  if request.method == 'POST':
    received_json = json.loads(request.body.decode('utf-8'))
    # received_json_str = received_json.decode('utf-8')
    received_payload = received_json['data']
    re = struct.unpack('IIdd', base64.b64decode(received_payload))
    print(re)
    return HttpResponse("Get the post data.")
    
    
