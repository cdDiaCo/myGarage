from models import UserProfile, Car, Cleaning
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms



class UserForm(UserCreationForm):    

    class Meta:
        model = User
        fields = ('username', 'first_name')
        
        
class CarForm(forms.ModelForm):        
    class Meta: 
        model = Car
        fields = ('manufacturer_name', 'model_name')


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('birth_date',)
        
        
class AddNewCar(forms.ModelForm):
    class Meta: 
        model = Car
        fields = (
                     'manufacturer_name', 'model_name', 'year_make', 'fuel_type', 
                     'km_purchased', 'registration_number', 'vin'
                 )
        
class AddCleaning(forms.ModelForm):
    class Meta:
        model = Cleaning  
        fields = ('cleaning_date', 'cleaning_cost', 'cleaning_type')           