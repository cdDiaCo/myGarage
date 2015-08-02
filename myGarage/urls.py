from myGarageClient.views import user_logout, first_page, addNewCar, garageView, carCleanings, carRefuellings, carServices, \
    carRevisions, carTaxes, getCars, carInsurances
from django.contrib import admin
from django.conf.urls import patterns, url, include
from myGarageClient import views
from django.conf.urls import include
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'myGarage.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    #url(r'^register/$', register),
    #url(r'^login/$', user_login),
    url(r'^logout/$', user_logout),
    #url(r'^home/$', home_page),
    url(r'^new_car/$', addNewCar),
    #url(r'^my_cars/$', myCars),
    #url(r'^my_cars/\d+/$', myCars),
    url(r'^cleanings/$', carCleanings),
    url(r'^refuellings/$', carRefuellings),
    url(r'^service/$', carServices),
    url(r'^revisions/$', carRevisions),
    url(r'^taxes/$', carTaxes),
    url(r'^insurances', carInsurances),
    url(r'^cars/user/(\d{1})/$', getCars),
    url(r'^garage/$', garageView),
    url(r'^garage/(\d{1})/$', garageView),
    url(r'^$', first_page),

)


