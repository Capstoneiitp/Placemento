from django.urls import path
from . import views

urlpatterns = [
    path('api/chat/', views.chat, name='chat'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('predict/', views.predict, name='predict'),
]