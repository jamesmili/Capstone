# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2019-04-03 21:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wiseturn', '0007_auto_20190402_0527'),
    ]

    operations = [
        migrations.AddField(
            model_name='wtuser',
            name='school',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]