from myGarageApi.models import Car
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms
#
class UserForm(UserCreationForm):
    class Meta:
        model = User
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
#
#
# class UserProfileForm(forms.ModelForm):
#     class Meta:
#         model = UserProfile
#         fields = ('birth_date',)
#
#
# class AddNewCar(forms.ModelForm):
#     class Meta:
#         model = Car
#         fields = (
#                      'manufacturer_name', 'model_name', 'year_make', 'fuel_type',
#                      'km_purchased', 'registration_number', 'vin'
#                  )
#
#
# class RefuellingForm(forms.ModelForm):
#     class Meta:
#         model = Refuelling
#         fields = ('refuel_date', 'current_mileage', 'sum_refuelled', 'quantity_refuelled')
#
#
# class CleaningForm(forms.ModelForm):
#     class Meta:
#         model = Cleaning
#         fields = ('cleaning_date', 'cleaning_cost', 'cleaning_type')
#
#
# class ServiceForm(forms.ModelForm):
#     class Meta:
#         model = Service
#         fields = ('service_date', 'description', 'service_cost')
#
# class RevisionForm(forms.ModelForm):
#     class Meta:
#         model = Revision
#         fields = ('revision_date', 'observations', 'auto_service_name', 'revision_cost', 'itp')
#
# class TaxForm(forms.ModelForm):
#     class Meta:
#         model = Tax
#         fields = ('tax_begin_date', 'tax_end_date', 'tax_sum', 'vignete')
#
# class InsuranceForm(forms.ModelForm):
#     class Meta:
#         model = Insurance
#         fields = ('insurance_begin_date', 'insurance_end_date', 'insurance_company', 'insurance_type', 'insurance_cost', 'acquisition_place')
#
# class TyreForm(forms.ModelForm):
#     class Meta:
#         model = Tyre
#         fields = ('manufacturer', 'model', 'type', 'quantity', 'acquisition_date', 'acquisition_price', 'state', )
#
#
#
#
#
