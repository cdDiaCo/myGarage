
# Create your models here.
from django.db import models
from django.contrib.auth.models import User


FUEL_TYPES = (
        ('Gasoline', 'Gasoline'),
        ('Diesel', 'Diesel'),
        ('Liquefied Petroleum', 'Liquefied Petroleum'),
        ('Compressed Natural Gas', 'Compressed Natural Gas'),
        ('Ethanol', 'Ethanol'),
    )


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
    manufacturer_name   = models.CharField(max_length=30, verbose_name='Make')
    model_name          = models.CharField(max_length=30, verbose_name='Model') 
    year_make           = models.IntegerField(max_length=4, verbose_name='Year of fabrication', null=True, blank=True)
    """
    FUEL_TYPES = (
        ('GAS', 'Gasoline'),
        ('DSL', 'Diesel'),
        ('LQP', 'Liquefied Petroleum'),
        ('CNG', 'Compressed Natural Gas'),
        ('ETH', 'Ethanol'),
    ) 
    """      

     
    fuel_type           = models.CharField(max_length=30, choices=FUEL_TYPES, default='Gasoline', verbose_name='Type of fuel', blank=True)
    
    km_purchased        = models.IntegerField(verbose_name='Nr. of km when purchased', null=True, blank=True)
    vin                 = models.IntegerField(blank=True, null=True, verbose_name='Vehicle Identification Number')
    user                = models.ForeignKey(User, related_name='cars')
    
    def __unicode__(self):
        return self.manufacturer_name + " " + self.model_name        
        
        
        
class Refuelling(models.Model):
    refuel_date = models.DateField()
    current_millage = models.IntegerField()
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




