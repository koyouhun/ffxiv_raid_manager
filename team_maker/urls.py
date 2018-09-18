from django.contrib import admin
from django.urls import include, path
from team_maker import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', views.index),
]
