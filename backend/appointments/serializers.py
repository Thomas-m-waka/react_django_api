from rest_framework import serializers
from django.contrib.auth import get_user_model
from phonenumber_field.serializerfields import PhoneNumberField
from .models import *



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number']  


class CustomUserCreateSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(required=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'password', 'userprofile')  
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        userprofile_data = validated_data.pop('userprofile')     
        user = get_user_model().objects.create_user(**validated_data)        
        UserProfile.objects.create(user=user, **userprofile_data)
        return user






class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'category', 'description', 'price', 'image', 'is_selected']



class PaymentSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ['id', 'user', 'service', 'amount', 'reference', 'status', 'created_at', 'user_profile']
        extra_kwargs = {
            'user': {'required': False},
            'amount': {'required': False}
        }
    def get_user_profile(self, obj):
        return {
            "email": obj.user.email,
            "phone_number": str(obj.user.userprofile.phone_number)
        }

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email') 
    username = serializers.CharField(source='user.username')
    class Meta:
        model = UserProfile
        fields = ['email', 'phone_number','username']


class AppointmentSerializer(serializers.ModelSerializer):
    service = ServiceSerializer()
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    payment = PaymentSerializer()

    class Meta:
        model = Appointment
        fields = ['id', 'service', 'user', 'payment', 'appointment_date', 'status']
        read_only_fields = ['user', 'payment']



