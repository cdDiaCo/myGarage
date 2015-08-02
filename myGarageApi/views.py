from .models import Car, Refuelling, Cleaning, Service, Revision, Tax, Insurance, Tyre
from django.contrib.auth.models import User

from .serializers import CarSerializer, UserSerializer, RefuellingSerializer, CleaningSerializer, ServiceSerializer, \
    RevisionSerializer, TaxSerializer, InsuranceSerializer, TyreSerializer
from rest_framework import viewsets


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(username=user)


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

    def get_queryset(self):
        user = self.request.user
        return Car.objects.filter(user__username=user)


class RefuellingViewSet(viewsets.ModelViewSet):
    queryset = Refuelling.objects.all()
    serializer_class = RefuellingSerializer

    def get_queryset(self):
        user = self.request.user
        return Refuelling.objects.filter(car__user__username=user)


class CleaningViewSet(viewsets.ModelViewSet):
    queryset = Cleaning.objects.all()
    serializer_class = CleaningSerializer

    def get_queryset(self):
        user = self.request.user
        return Cleaning.objects.filter(car__user__username=user)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_queryset(self):
        user = self.request.user
        return Service.objects.filter(car__user__username=user)


class RevisionViewSet(viewsets.ModelViewSet):
    queryset = Revision.objects.all()
    serializer_class = RevisionSerializer

    def get_queryset(self):
        user = self.request.user
        return Revision.objects.filter(car__user__username=user)


class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer

    def get_queryset(self):
        user = self.request.user
        return Tax.objects.filter(car__user__username=user)


class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.all()
    serializer_class = InsuranceSerializer

    def get_queryset(self):
        user = self.request.user
        return Insurance.objects.filter(car__user__username=user)


class TyreViewSet(viewsets.ModelViewSet):
    queryset = Tyre.objects.all()
    serializer_class = TyreSerializer

    def get_queryset(self):
        user = self.request.user
        return Tyre.objects.filter(car__user__username=user)
