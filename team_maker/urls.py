from django.contrib import admin
from django.urls import include, path
import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
