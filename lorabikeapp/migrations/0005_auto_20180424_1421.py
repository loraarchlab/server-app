# Generated by Django 2.0.4 on 2018-04-24 06:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lorabikeapp', '0004_auto_20180424_1420'),
    ]

    operations = [
        migrations.RenameField(
            model_name='location',
            old_name='cordinate_x',
            new_name='co_x',
        ),
        migrations.RenameField(
            model_name='location',
            old_name='cordinate_y',
            new_name='co_y',
        ),
    ]
