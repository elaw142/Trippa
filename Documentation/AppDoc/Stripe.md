Documentation:
https://stripe.com/docs


## Usage...

- Csharp
```cs
StripeConfiguration.ApiKey = "sk_test_BQokikJOvBiI2HlWgH4olfQ2";

// Create a payment intent to start a purchase flow.
var options = new PaymentIntentCreateOptions
{
    Amount = 2000,
    Currency = "usd",
    Description = "My first payment",
};
var service = new PaymentIntentService();
var paymentIntent = service.Create(options);

// Complete the payment using a test card.
var confirmOptions = new PaymentIntentConfirmOptions
{
    PaymentMethod = "pm_card_mastercard",
};
service.Confirm(paymentIntent.Id, confirmOptions);
```