# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2019-04-01 20:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wiseturn', '0005_auto_20190401_1944'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wtuser',
            name='birthday',
            field=models.DateField(),
        ),
    ]
