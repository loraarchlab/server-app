# Generated by Django 2.0.4 on 2018-04-25 06:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lorabikeapp', '0006_auto_20180424_1527'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='device_id',
            field=models.CharField(default='0101010101010101', max_length=16),
            preserve_default=False,
        ),
    ]
