from django.contrib.auth.models import User

from rest_framework import serializers
from .models import Car, Refuelling, Cleaning, Service, Revision, Tax, Insurance, Tyre


class UserSerializer(serializers.HyperlinkedModelSerializer):
    cars = serializers.HyperlinkedRelatedField(many=True, view_name='car-detail', read_only=True)

    class Meta:
        model = User
        fields = ('cars', 'username')


class CarSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='user-detail', read_only=True)

    class Meta:
        model = Car
        fields = ('user', 'pk', 'registration_number', 'manufacturer_name', 'model_name', 'year_make', 'fuel_type',
                  'km_purchased', 'vin')


class RefuellingSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Refuelling
        fields = ('pk', 'car', 'refuel_date', 'current_mileage', 'quantity_refuelled', 'sum_refuelled')


class CleaningSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Cleaning
        fields = ('pk', 'car', 'cleaning_date', 'cleaning_cost', 'cleaning_type')


class ServiceSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Service
        fields = ('pk', 'car', 'service_date', 'description', 'service_cost')


class RevisionSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Revision
        fields = ('pk', 'car', 'revision_date', 'observations', 'auto_service_name', 'revision_cost', 'itp')


class TaxSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Tax
        fields = ('pk', 'car', 'tax_begin_date', 'tax_end_date', 'tax_sum', 'vignete')


class InsuranceSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Insurance
        fields = ('pk', 'car', 'insurance_begin_date', 'insurance_end_date', 'insurance_company', 'insurance_type',
                  'insurance_cost', 'acquisition_place')


class TyreSerializer(serializers.HyperlinkedModelSerializer):
    serializers.HyperlinkedRelatedField(view_name='car-detail', read_only=True)

    class Meta:
        model = Tyre
        fields = ('pk', 'car', 'manufacturer', 'model', 'type', 'quantity', 'acquisition_date', 'acquisition_price',
                  'state')
