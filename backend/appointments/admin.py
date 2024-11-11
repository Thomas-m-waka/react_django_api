from django.contrib import admin
from .models import *

admin.site.register(UserProfile)
admin.site.register(Service)
admin.site.register(Payment)
admin.site.register(Appointment)

