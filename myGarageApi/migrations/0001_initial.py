# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    needed_by = (
        ('authtoken', '0001_initial'),
    )

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Car',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('registration_number', models.CharField(null=True, blank=True, max_length=30)),
                ('manufacturer_name', models.CharField(max_length=30, verbose_name='Make')),
                ('model_name', models.CharField(max_length=30, verbose_name='Model')),
                ('year_make', models.IntegerField(null=True, blank=True, verbose_name='Year of fabrication')),
                ('fuel_type', models.CharField(blank=True, choices=[('Gasoline', 'Gasoline'), ('Diesel', 'Diesel'), ('Liquefied Petroleum', 'Liquefied Petroleum'), ('Compressed Natural Gas', 'Compressed Natural Gas'), ('Ethanol', 'Ethanol')], verbose_name='Type of fuel', default='Gasoline', max_length=30)),
                ('km_purchased', models.IntegerField(null=True, blank=True, verbose_name='Nr. of km when purchased')),
                ('vin', models.IntegerField(null=True, blank=True, verbose_name='Vehicle Identification Number')),
                ('user', models.ForeignKey(related_name='cars', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Cleaning',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('cleaning_date', models.DateField()),
                ('cleaning_cost', models.FloatField()),
                ('cleaning_type', models.CharField(max_length=30)),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='Insurance',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('insurance_begin_date', models.DateField()),
                ('insurance_end_date', models.DateField()),
                ('insurance_company', models.CharField(max_length=45)),
                ('insurance_type', models.CharField(max_length=45)),
                ('insurance_cost', models.FloatField()),
                ('acquisition_place', models.CharField(max_length=45)),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='Refuelling',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('refuel_date', models.DateField()),
                ('current_mileage', models.IntegerField()),
                ('quantity_refuelled', models.FloatField()),
                ('sum_refuelled', models.FloatField()),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('revision_date', models.DateField()),
                ('observations', models.CharField(max_length=45)),
                ('auto_service_name', models.CharField(max_length=45)),
                ('revision_cost', models.FloatField()),
                ('itp', models.CharField(blank=True, choices=[('yes', 'yes'), ('no', 'no')], verbose_name='itp', default='no', max_length=3)),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('service_date', models.DateField()),
                ('description', models.CharField(max_length=45)),
                ('service_cost', models.FloatField()),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='Tax',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('tax_begin_date', models.DateField()),
                ('tax_end_date', models.DateField()),
                ('tax_sum', models.FloatField()),
                ('vignete', models.CharField(blank=True, choices=[('yes', 'yes'), ('no', 'no')], verbose_name='vignete', default='no', max_length=3)),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='Tyre',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('manufacturer', models.CharField(max_length=45)),
                ('model', models.CharField(max_length=45)),
                ('type', models.CharField(blank=True, choices=[('winter', 'winter'), ('summer', 'summer')], verbose_name='tyre types', default='summer', max_length=6)),
                ('quantity', models.IntegerField()),
                ('acquisition_date', models.DateField()),
                ('acquisition_price', models.FloatField()),
                ('state', models.CharField(blank=True, choices=[('new', 'new'), ('used', 'used'), ('expired', 'expired')], verbose_name='tyre state', default='new', max_length=7)),
                ('car', models.ForeignKey(to='myGarageApi.Car')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('birth_date', models.DateField(null=True, blank=True)),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
