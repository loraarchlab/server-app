from django.urls import path

from . import views

urlpatterns = [
    path('uplink/', views.uplink, name='uplink'),
    path('uplink/mock/', views.uplink_mock, name='uplink-mock'),
    path('livemap/<int:begin_id>-<int:end_id>/', views.livemap, name='livemap'),
    path('livemap/<int:begin_id>-<int:end_id>/ajax/', views.livemap_ajax, name='livemap-ajax'),
    path('datarecord/<str:begin_time>/<str:end_time>/<int:begin_id>-<int:end_id>/', views.datarecord, name='datarecord'),
]
