# lora-server-app

## Introduction

A lora server app for monitoring and visualizing bike locations.

Use [Django](https://www.djangoproject.com/) as backend server and [Baidu Javascript API](http://lbsyun.baidu.com/index.php?title=jspopular) to render map at front-end.

## Run
```
python manage.py runserver 0.0.0.0:8000
```

You can visit `localhost:8000/lorabikeapp/datarecord/2018-04-25-20-00-00/2018-04-25-21-00-00/1-1/`
for the bike `No.1`'s movement during 20:00 - 21:00 at 25th, April 2018.
