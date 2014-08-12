
# Register your models here.
from django.contrib import admin
from models import Car, Refuelling, Cleaning
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User


#UserAdmin.list_display = ('email', 'first_name', 'last_name', 'is_active', 'date_joined', 'is_staff')

class UserAdminExtended(UserAdmin):    
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'is_staff')
    list_filter = ('date_joined',)
    ordering = ('-date_joined',)
 
class CarAdmin(admin.ModelAdmin):
    list_display = ('manufacturer_name', 'model_name', 'year_make', 'user' )    


admin.site.unregister(User)
admin.site.register(User, UserAdminExtended) 
admin.site.register(Car, CarAdmin)
admin.site.register(Refuelling)
admin.site.register(Cleaning)