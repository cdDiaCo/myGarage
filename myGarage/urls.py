from myGarageClient.views import user_logout, first_page, garageView, getCars
from django.contrib import admin
from django.conf.urls import patterns, url
from django.conf.urls import include

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^api/v1/', include('myGarageApi.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout/$', user_logout),
    url(r'^cars/user/(\d{1})/$', getCars),
    url(r'^garage/$', garageView),
    url(r'^garage/(\d{1})/$', garageView),
    url(r'^$', first_page),
)


