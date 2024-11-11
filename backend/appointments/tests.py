import requests
from django.conf import settings
from django.shortcuts import render, redirect
import uuid

def initiate_payment(request):
    # Paystack Secret Key from your Paystack account settings
    secret_key = settings.PAYSTACK_SECRET_KEY  # Your Paystack secret key here

    # User data (this would typically come from the request or a logged-in user)
    phone_number = "+254791508494"  # User's phone number (as provided)
    email = "thomasmuteti4@gmail.com"  # User's email (as provided)
    amount = 1000  # Amount to charge (in Naira, in this case 1000 Naira)
    reference = str(uuid.uuid4())  # Unique reference for this payment transaction

    # Paystack API URL for initiating payments
    url = "https://api.paystack.co/transaction/initialize"

    # Prepare the data to send in the request
    data = {
        "amount": amount * 100,  # Paystack expects amount in Kobo (1 Naira = 100 Kobo)
        "email": email,
        "phone": phone_number,
        "reference": reference,  # Unique reference for the transaction
        "metadata": {
            "custom_fields": [
                {
                    "display_name": "Phone Number",
                    "variable_name": "phone_number",
                    "value": phone_number
                }
            ]
        }
    }

    # Set headers for authentication with your Paystack secret key
    headers = {
        "Authorization": f"Bearer {secret_key}",
        "Content-Type": "application/json"
    }

    # Send the POST request to Paystack's API
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        authorization_url = response_data['data']['authorization_url']
        return redirect(authorization_url)  # Redirect user to Paystack's payment page
    else:
        print(f"Error initiating payment: {response.json()}")
        return render(request, "payment_error.html")  # Show an error page if request fails
