from models import UserProfile, Car, Cleaning
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms



class UserForm(UserCreationForm):     
    #password = forms.CharField(widget=forms.PasswordInput())   
    #loginUsername = forms.CharField(label='Username',  max_length=30)

 
    class Meta:
        model = User       
        #fields = ('username', 'loginUsername', 'password', 'first_name')
        fields = ('username', 'first_name')
        
    def getRegisterFormKeys(self):
        return ('username', 'password1', 'password2')   
  
  

        
class CarForm(forms.ModelForm):            
    class Meta: 
        model = Car
        fields = ('manufacturer_name', 'model_name')
        widgets = {
            'manufacturer_name': forms.TextInput(attrs={'placeholder': 'Car make'}),       
            'model_name': forms.TextInput(attrs={'placeholder': 'Car model'}),
        }
        
    def getKeys(self):
        return ('manufacturer_name', 'model_name')


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