from django.urls import path
from api import views

urlpatterns = [
    path('make', views.make_team, name='make'),
    path('search', views.search_team, name='search'),
    path('load', views.load_team, name='load'),
    path('save/fix', views.save_fix, name='save_fix'),
    path('save/job', views.save_job, name='save_job'),
]