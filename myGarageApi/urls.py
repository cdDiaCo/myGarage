from django.conf.urls import url, include
from .views import UserViewSet, CarViewSet, RefuellingViewSet, CleaningViewSet, ServiceViewSet, RevisionViewSet, \
    TaxViewSet, InsuranceViewSet, TyreViewSet, get_columns_meta
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views

# Create a router and register viewsets with it.
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cars', CarViewSet)
router.register(r'refuellings', RefuellingViewSet)
router.register(r'cleanings', CleaningViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'revisions', RevisionViewSet)
router.register(r'taxes', TaxViewSet)
router.register(r'insurances', InsuranceViewSet)
router.register(r'tyres', TyreViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^columns/(?P<model_name>.+)/$', get_columns_meta),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', views.obtain_auth_token)
]
