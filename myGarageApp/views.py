from django.shortcuts import render

# Create your views here.
import django
from django.core.context_processors import csrf
from django.shortcuts import render
from django.utils.decorators import method_decorator
from forms import UserProfileForm, CarForm,UserForm, AddNewCar, AddCleaning
from django.contrib.auth.forms import UserCreationForm
from models import UserProfile, Car, Cleaning
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, csrf_exempt, ensure_csrf_cookie
import json

"""
#@method_decorator(csrf_exempt)
#@ensure_csrf_cookie
def save_events_json(request):
    print "im a " + request.method
    if request.method == 'POST':
        b = request.COOKIES.get("csrftoken", None)
        print str(b)

        d = json.loads(request.body)
        print d


    #return HttpResponse("OOOOOKKKKK")
    return render(request, 'checkjson.html', {})
"""






def home_page(request):  
    if request.user.is_authenticated():
        return HttpResponseRedirect("/garage/")
    
    context = RequestContext(request)    
    registered = False 
     
    if request.method == 'POST':
        if 'manufacturer_name' in request.POST:
            #do register
            user_form = UserCreationForm(data=request.POST)
            #profile_form = UserProfileForm(data=request.POST)
            car_form = CarForm(data=request.POST)
            
            if user_form.is_valid() and car_form.is_valid():                
                user = user_form.save()  
                car = car_form.save(commit=False) 
                car.user = user
                car.save()               
                #profile = profile_form.save(commit=False)
                #profile.user = user              
                #profile.save()                
                registered = True    
            else:
                print user_form.errors, car_form.errors
        else:
            # do login  
            username = request.POST['username']
            password = request.POST['password']
    
            user = authenticate(username=username, password=password)
            if user:                
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect("/garage/")
                else:                    
                    return HttpResponse("Your account is disabled.")
            else:                
                print "Invalid login details: {0}, {1}".format(username, password)
                return HttpResponse("Invalid login details supplied.")
    else:
        user_form = UserCreationForm()
        car_form = CarForm()
        #profile_form = UserProfileForm()          
     
    
    return render_to_response(
            'index.html',
            {'user_form': user_form, 'car_form': car_form, 'registered': registered,},
            context)  

    
    
@login_required
def garageView(request, offset=False):
    user = request.user    
    selectedCarValue = False
    firstTime = True
    
    
    if 'selectedCar' in request.session:
        selectedCar = request.session['selectedCar']         
        selectedCarValue = selectedCar['selectedValue']   
        firstTime = False
                        
    
    if offset:        
        car_id = offset[0] 
        if 'user_cars' in request.session:
            selectedCar = request.session['user_cars'][car_id] 
            request.session['selectedCar'] = selectedCar                                                  
        return HttpResponse(car_id)     
    else:           
        userID = request.user.id
        cars = Car.objects.filter(user_id=userID)                
        userCars = {}                        
        for x in range(0, cars.count()):                                     
            userCars[x]= {
                'selectedValue': str(x),         
                'id': cars[x].__hash__(), 
                'reg_nr': cars[x].registration_number, 
                'make': cars[x].manufacturer_name, 
                'model': cars[x].model_name, 
                'year': cars[x].year_make, 
                'fuel_type': cars[x].fuel_type,
                'km_purchased': cars[x].km_purchased, 
                'vin': cars[x].vin
            }              
        request.session['user_cars'] = userCars      
                
    return render(request, 'garage.html', {
        'user': user, 
        'cars': cars, 
        'selectedCarValue': selectedCarValue, 
        'firstTime': firstTime
    })
        
            
        
     


@login_required
def myCars(request, offset=False):    
    if offset:        
        car_id = offset[0]     
        print("in offset")    
        if 'user_cars' in request.session and request.session['user_cars']:
            selectedCar = request.session['user_cars'][car_id] 
            request.session['selectedCar'] = selectedCar  
                                 
        return HttpResponse(car_id)    
    
    else:    
        print("in else")
        username = request.user
        userpID = request.user.profile.id
        print(userpID)
        cars = Car.objects.filter(user_id=userpID)
        if cars.exists():             
            userCars = {}                        
            for x in range(0, cars.count()):                                     
                userCars[x]= {
                    'id': cars[x].__hash__(), 
                    'reg_nr': cars[x].registration_number, 
                    'make': cars[x].manufacturer_name, 
                    'model': cars[x].model_name, 
                    'year': cars[x].year_make, 
                    'fuel_type': cars[x].fuel_type,
                    'km_purchased': cars[x].km_purchased, 
                    'vin': cars[x].vin
                }              
            request.session['user_cars'] = userCars
            print("return cars")
            return render(request, 'myCars.html', {'username': username, 'cars': cars }) 
        else:
            request.session['no_cars'] = True   
            print("return False")
            return render(request, 'myCars.html', {'username': "aaaaaaaaaaaaaaa", 'cars': False }) 


@login_required
def addNewCar(request):
    
    registered = False
    
    if request.method == 'POST':
        newCar_form = AddNewCar(data=request.POST)
        
        if newCar_form.is_valid():
            newCar = newCar_form.save(commit=False)            
            user = request.user           
            newCar.user = user
            newCar.save()
            
            registered = True
        else:
            print newCar_form.errors
    else:
        newCar_form = AddNewCar()
        
    return render(request, 'newCar.html', {'newCar': newCar_form, 'registered': registered, 'user_id': request.user.id} )                


@login_required
def addCleaning(request):
    #check if the user has added a car...    
    if 'selectedCar' in request.session:
        selectedCar = request.session['selectedCar']
        car = Car.objects.get(id=selectedCar['id'])
    
        registered = False        
        if request.method == 'POST':
            newCleaning_form = AddCleaning(data=request.POST)
            
            if newCleaning_form.is_valid():
                newCleaning = newCleaning_form.save(commit=False)            
                newCleaning.car = car
                newCleaning.save()
                
                registered = True
            else:
                print newCleaning_form.errors
        else:
            newCleaning_form = AddCleaning()
            
        return render(request, 'newCleaning.html', {'newCleaning': newCleaning_form, 'registered': registered, 
        'selectedCar' : car} ) 
    else:    
        car = False                 
        return render(request, 'newCleaning.html', {'selectedCar' : car} )                
    
            
@login_required             
def carCleanings(request):
        if 'selectedCar' in request.session:
            selectedCar = request.session['selectedCar']
            cleanings = Cleaning.objects.filter(car_id=selectedCar['id'])
            return render(request, 'garage.html', {'cleanings' : cleanings} ) 
            
                   
    
# Use the login_required() decorator to ensure only those logged in can access the view.
@login_required
def user_logout(request):
    # Since we know the user is logged in, we can now just log them out.
    logout(request)

    # Take the user back to the homepage.
    return HttpResponseRedirect('/')     



  
   
   
    
    