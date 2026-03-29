from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index),
    path('add', views.add, name="add"),
    path('<int:el_id>/delete', views.delete, name="delete"),
    path('<int:el_id>/update', views.update, name="update"),

    path("signup", views.signup, name="signup"),
    path('', include('django.contrib.auth.urls')),
]
