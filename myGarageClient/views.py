from django.shortcuts import render
from myGarageClient.forms import CarForm, UserForm
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


def first_page(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect("/garage/")
    
    context = RequestContext(request)    
    registered = False 
    carErrorList = {'manufacturer_name': "", 'model_name': ""}
    userErrorList = {'username': "", 'password1': "", 'password2': ""}   
    tempFields = {}
     
    if request.method == 'POST':
        if 'manufacturer_name' in request.POST:
            #do register
            user_form = UserForm(data=request.POST)
            #profile_form = UserProfileForm(data=request.POST)
            car_form = CarForm(data=request.POST)
            
            tempFields['username'] = request.POST.get("username", "")
            tempFields['password1'] = request.POST.get("password1", "")
            tempFields['password2'] = request.POST.get("password2", "")
            tempFields['carMake'] = request.POST.get("manufacturer_name", "")
            tempFields['carModel'] = request.POST.get("model_name", "")                      
            
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
                print(user_form.errors, car_form.errors)
                for key in car_form.getKeys():
                    if key in car_form.errors:                        
                        for error in car_form.errors[key]:                                                              		
                            carErrorList[key] += error+" "
                            
                for key in user_form.getRegisterFormKeys():                                       			 
                    if key in user_form.errors:                        
                        for error in user_form.errors[key]:                           								 		
                            userErrorList[key] += error+" "                            
        else:
            # do login  
            username = request.POST['loginUsername']
            password = request.POST['loginPassword']
    
            user = authenticate(username=username, password=password)
            if user:                
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect("/garage/")
                else:                    
                    return HttpResponse("Your account is disabled.")
            else:                
                print("Invalid login details: {0}, {1}".format(username, password))
                return HttpResponse("Invalid login details supplied.")
                         
    else:
        user_form = UserForm()        
        car_form = CarForm()
        #profile_form = UserProfileForm()        
        
    return render_to_response(
            'index.html',
            {'user_form': user_form, 'car_form': car_form, 
             'registered': registered, 'carErrorList': carErrorList, 
             'userErrorList': userErrorList, 'tempFields': tempFields,}, context)  
    
    
@login_required
def garageView(request, offset=False):
    return render(request, 'garage.html', {'userID': request.user.id})



def getCars(request, offset=False):
    if request.is_ajax():
        message = "this is ajax"
    else:
        message = "this is not ajax"

    response = {}
    response['firstCar'] = {'carID': '1', 'registration_number': '1233', 'manufacturer_name': 'Dacia', 'model_name': 'Logan'}
    response['secCar'] = {'carID': '2', 'registration_number': '444', 'manufacturer_name': 'Dacia', 'model_name': 'Duster'}
    return JsonResponse(response)


# Use the login_required() decorator to ensure only those logged in can access the view.
@login_required
def user_logout(request):
    # Since we know the user is logged in, we can now just log them out.
    logout(request)

    # Take the user back to the homepage.
    return HttpResponseRedirect('/')

