from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = PhoneNumberField(null=True, blank=True, unique=True)

    def __str__(self):
        return self.user.username

class Service(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    image = models.ImageField(upload_to='services/', blank=True, null=True)  
    is_selected = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)  # Single service per payment
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=255, unique=True)  
    paystack_url = models.URLField(null=True, blank=True)   
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Payment {self.reference} for {self.user.username}'

class Appointment(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE)  
    appointment_date = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('completed', 'Completed')], default='pending')

    def __str__(self):
        return f"Appointment for {self.service.title} on {self.appointment_date}"
