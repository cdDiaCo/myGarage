from models import UserProfile, Car, Cleaning
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms



class UserForm(UserCreationForm): 
    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)        
        self.fields['username'].widget = forms.TextInput(attrs={'placeholder': 'Choose your username'})
        self.fields['password1'].widget = forms.TextInput(attrs={'placeholder': 'New password'})
        self.fields['password2'].widget = forms.TextInput(attrs={'placeholder': 'Re-enter new password'}) 
         
    password = forms.CharField(widget=forms.PasswordInput())   
    loginUsername = forms.CharField(label='Username',  max_length=30)

 
    class Meta:
        model = User       
        fields = ('username', 'loginUsername', 'password', 'first_name')
        
   
        
class CarForm(forms.ModelForm):        
    class Meta: 
        model = Car
        fields = ('manufacturer_name', 'model_name')
        widgets = {
            'manufacturer_name': forms.TextInput(attrs={'placeholder': 'Car make'}),       
            'model_name': forms.TextInput(attrs={'placeholder': 'Car model'}),
        }


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