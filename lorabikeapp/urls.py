from django.urls import path

from . import views

urlpatterns = [
    path('uplink/', views.uplink, name='uplink'),
]
