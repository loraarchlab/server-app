from django.db import models

# Create your models here.
class Location(models.Model):
  frame_count = models.PositiveIntegerField(default = 0)
  track_time = models.DateTimeField()
  latitude = models.FloatField(default = 0)
  longitude = models.FloatField(default = 0)
  snr = models.FloatField(default = 0)
  rssi = models.IntegerField(default = 0)
