# from myGarageClient.views import user_logout, home_page, addNewCar, garageView, carCleanings, carRefuellings, carServices, \
#     carRevisions, carTaxes, ajaxView, carInsurances
# from myGarageClient.views import user_logout, home_page, garageView
from django.contrib import admin
from django.conf.urls import patterns, url
from django.conf.urls import include
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^api/v1/', include('myGarageApi.urls')),
    url(r'^admin/', include(admin.site.urls)),
    # url(r'^logout/$', user_logout),
    # # url(r'^garage/$', garageView),
    # # url(r'^garage/(\d{1})/$', garageView),
    # url(r'^$', home_page),
)


