from django.db import models

# Create your models here.
class Location(models.Model):
  device_id = models.PositiveIntegerField(default = 0)
  frame_count = models.PositiveIntegerField(default = 0)
  track_time = models.DateTimeField(auto_now_add = True)
  latitude = models.FloatField(default = 0)
  longitude = models.FloatField(default = 0)
  co_x = models.FloatField(default = 0)
  co_y = models.FloatField(default = 0)
  snr = models.FloatField(default = 0)
  rssi = models.IntegerField(default = 0)
