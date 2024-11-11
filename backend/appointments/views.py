from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import *
from .serializers import *
import requests
from django.conf import settings
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import ListAPIView
from rest_framework import generics
from djoser.serializers import UserCreateSerializer
from .serializers import *
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        try:
            
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({"detail": "Refresh token required."}, status=400)

            
            token = RefreshToken(refresh_token)

            
            token.blacklist()

            return Response({"detail": "Successfully logged out."})

        except InvalidToken:
            return Response({"detail": "Invalid refresh token."}, status=400)





class CustomUserCreateView(generics.CreateAPIView):
    serializer_class = CustomUserCreateSerializer





class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        try:
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile)
            data = serializer.data
        except UserProfile.DoesNotExist:
            data = {
                'username': user.username,
                'email': user.email,
                'phone_number': None,  
            }

        return Response(data)
    
class ServiceListView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]  

@method_decorator(csrf_exempt, name='dispatch')
class PaymentVerificationView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request, *args, **kwargs):
        reference = request.data.get('reference')  # Payment reference (Paystack reference)
        service_id = request.data.get('service_id')  # The ID of the service the user selected

        if not reference:
            return Response({'status': 'failed', 'message': 'Reference is required'}, status=400)

        if not service_id:
            return Response({'status': 'failed', 'message': 'Service ID is required'}, status=400)

        # Verify payment via Paystack API
        payment_data = self.verify_payment(reference)
        if not payment_data:
            return Response({'status': 'failed', 'message': 'Payment verification failed.'}, status=400)

        # Fetch the selected service from the database
        service = Service.objects.filter(id=service_id).first()
        if not service:
            return Response({'status': 'failed', 'message': 'Service not found'}, status=404)

        # Check if the payment amount matches the service price
        amount_paid = payment_data['amount'] / 100  # Convert from kobo to naira (or appropriate currency)
        if amount_paid != service.price:
            return Response({'status': 'failed', 'message': 'Payment amount does not match service price.'}, status=400)

        # Get user from the payment data (assuming Paystack gives this info)
        customer_info = self.extract_customer_info(payment_data)
        user = self.get_user_by_email(customer_info['email'])
        if not user:
            return Response({'status': 'failed', 'message': 'User not found'}, status=404)

        # Create the payment record
        payment = self.create_payment(user, service, payment_data)

        # Create the appointment for the user and service
        appointment = self.create_appointment(user, service, payment)

        return Response({
            'status': 'success',
            'message': 'Payment verified successfully!',
            'payment_reference': payment.reference,
            'payment_details': customer_info,
            'appointment': appointment.id
        })

    def verify_payment(self, reference):
        """
        Call Paystack API to verify the payment with the provided reference.
        """
        url = f'https://api.paystack.co/transaction/verify/{reference}'
        headers = {'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}', 'Content-Type': 'application/json'}
        try:
            response = requests.get(url, headers=headers)
            response_data = response.json()
            if response_data['status'] and response_data['data']['status'] == 'success':
                return response_data['data']
        except requests.exceptions.RequestException:
            return None
        return None

    def extract_customer_info(self, payment_data):
        """
        Extract customer information from the Paystack payment data.
        """
        return {
            'name': f"{payment_data['customer']['first_name']} {payment_data['customer']['last_name']}",
            'email': payment_data['customer']['email'],
            'phone': payment_data['customer']['phone'],
            'amount_paid': payment_data['amount'] / 100,  # Convert from kobo to naira
            'status': payment_data['status'],
            'payment_time': payment_data['created_at']
        }

    def get_user_by_email(self, email):
        """
        Fetch user by their email address.
        """
        return User.objects.filter(email=email).first()

    def create_payment(self, user, service, payment_data):
        """
        Create a payment record for the user and service.
        """
        total_amount = service.price  # Payment is for a single service
        
        # Create the Payment record
        payment = Payment.objects.create(
            user=user,
            service=service,  # Link to the selected service
            amount=total_amount,
            reference=payment_data['reference'],
            status=payment_data['status'],
            paystack_url=payment_data.get('authorization_url', '')
        )

        return payment

    def create_appointment(self, user, service, payment):
        """
        Create an appointment for the user and service after payment is verified.
        """
        # Create an appointment linked to the service and payment
        appointment = Appointment.objects.create(
            user=user,
            service=service,
            payment=payment,
            appointment_date=timezone.now(),
            status='pending'
        )
        return appointment




class AppointmentListView(ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]  

    def get_queryset(self):
        """
        Override get_queryset to filter appointments for the authenticated user.
        """
        return Appointment.objects.filter(user=self.request.user)





class AppointmentDetailView(RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensures that only authenticated users can view the appointment

    def get_object(self):
        """
        Override get_object to ensure the user can only view their own appointments
        """
        appointment = super().get_object()
        # Ensure the user requesting the appointment is the owner of the appointment
        if appointment.user != self.request.user:
            raise PermissionDenied("You do not have permission to view this appointment.")
        return appointment

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)