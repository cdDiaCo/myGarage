from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

FUEL_TYPES = (
    ('Gasoline', 'Gasoline'),
    ('Diesel', 'Diesel'),
    ('Liquefied Petroleum', 'Liquefied Petroleum'),
    ('Compressed Natural Gas', 'Compressed Natural Gas'),
    ('Ethanol', 'Ethanol'),
)

ITP_OPTIONS = (
    ('yes', 'yes'),
    ('no', 'no'),
)

VIGNETE_OPTIONS = (
    ('yes', 'yes'),
    ('no', 'no'),
)

TYRE_TYPES = (
    ('winter', 'winter'),
    ('summer', 'summer'),
)

TYRE_STATE = (
    ('new', 'new'),
    ('used', 'used'),
    ('expired', 'expired'),
)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class UserProfile(models.Model):
    # This line is required. Links UserProfile to a User model instance.
    user = models.OneToOneField(User, related_name="profile")

    # The additional attributes we wish to include.
    birth_date = models.DateField(blank=True, null=True)

    # Override the __unicode__() method to return out something meaningful!
    def __unicode__(self):
        return self.user.username


class Car(models.Model):
    registration_number = models.CharField(max_length=30, blank=True, null=True)
    manufacturer_name = models.CharField(max_length=30, verbose_name='Make')
    model_name = models.CharField(max_length=30, verbose_name='Model')
    year_make = models.IntegerField(verbose_name='Year of fabrication', null=True, blank=True)
    fuel_type = models.CharField(max_length=30, choices=FUEL_TYPES, default='Gasoline',
                                 verbose_name='Type of fuel', blank=True)
    km_purchased = models.IntegerField(verbose_name='Nr. of km when purchased', null=True, blank=True)
    vin = models.IntegerField(blank=True, null=True, verbose_name='Vehicle Identification Number')
    user = models.ForeignKey(User, related_name='cars')

    def __unicode__(self):
        return self.manufacturer_name + " " + self.model_name


class Refuelling(models.Model):
    refuel_date = models.DateField()
    current_mileage = models.IntegerField()
    quantity_refuelled = models.FloatField()
    sum_refuelled = models.FloatField()
    car = models.ForeignKey(Car)


class Cleaning(models.Model):
    cleaning_date = models.DateField()
    cleaning_cost = models.FloatField()
    cleaning_type = models.CharField(max_length=30)
    car = models.ForeignKey(Car)

    def __unicode__(self):
        return self.cleaning_type


class Service(models.Model):
    service_date = models.DateField()
    description = models.CharField(max_length=45)
    service_cost = models.FloatField()
    car = models.ForeignKey(Car)


class Revision(models.Model):
    revision_date = models.DateField()
    observations = models.CharField(max_length=45)
    auto_service_name = models.CharField(max_length=45)
    revision_cost = models.FloatField()
    itp = models.CharField(max_length=3, choices=ITP_OPTIONS, default='no', verbose_name='itp', blank=True)
    car = models.ForeignKey(Car)


class Tax(models.Model):
    tax_begin_date = models.DateField()
    tax_end_date = models.DateField()
    tax_sum = models.FloatField()
    vignete = models.CharField(max_length=3, choices=VIGNETE_OPTIONS, default='no', verbose_name='vignete',
                               blank=True)
    car = models.ForeignKey(Car)


class Insurance(models.Model):
    insurance_begin_date = models.DateField()
    insurance_end_date = models.DateField()
    insurance_company = models.CharField(max_length=45)
    insurance_type = models.CharField(max_length=45)
    insurance_cost = models.FloatField()
    acquisition_place = models.CharField(max_length=45)
    car = models.ForeignKey(Car)


class Tyre(models.Model):
    manufacturer = models.CharField(max_length=45)
    model = models.CharField(max_length=45)
    type = models.CharField(max_length=6, choices=TYRE_TYPES, default='summer', verbose_name='tyre types', blank=True)
    quantity = models.IntegerField()
    acquisition_date = models.DateField()
    acquisition_price = models.FloatField()
    state = models.CharField(max_length=7, choices=TYRE_STATE, default='new', verbose_name='tyre state', blank=True)
    car = models.ForeignKey(Car)
