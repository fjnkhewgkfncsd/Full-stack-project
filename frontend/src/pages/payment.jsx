import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Separator
} from "../components/ui";
import {
  CreditCard,
  Shield,
  Lock,
  QrCode,
  Smartphone,
  Loader2
} from "lucide-react";

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7777';
  
  // State declarations
  const [billingAddress, setBillingAddress] = useState({
    firstName: "", lastName: "", email: "", address: "",
    city: "", state: "", zipCode: "", country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({ 
    billing: {}, 
    card: {}, 
    khqr: {}, 
    aba: {} 
  });

  // Mock order data
  const orderItems = [
    { name: "Premium Plan", price: 0.01, quantity: 1 },
    { name: "Additional Storage", price: 0, quantity: 2 },
  ];
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const sendTelegramNotification = async (status, cardDetails = null) => {
  try {
    const payload = {
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      amount: total,
      status,
      paymentMethod,
      ...(cardDetails && { cardDetails }),
      billingAddress: {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        email: billingAddress.email,
        address: billingAddress.address,
        city: billingAddress.city,
        state: billingAddress.state,
        zipCode: billingAddress.zipCode,
        country: billingAddress.country
      }
    };

    console.log('Sending Telegram payload:', payload); // Debug log

    const response = await axios.post(`${API_BASE}/api/notify/telegram`, payload, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Telegram notification error:', error.response?.data || error.message);
    throw error;
  }
};

  const processPayment = async () => {
    setErrorMessage(null);
    
    if (!isTermsAccepted) {
      setErrorMessage("Please accept the terms and conditions");
      return;
    }

    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;
      
      // For card payments
      if (paymentMethod === "card") {
        const cardDetails = {
          last4: document.getElementById('cardNumber')?.value?.slice(-4) || '0000',
          expiry: document.getElementById('expiry')?.value || '',
          cardName: document.getElementById('cardName')?.value || ''
        };

        await sendTelegramNotification('completed', cardDetails);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } 
      // For KHQR payments
      else if (paymentMethod === "khqr") {
        await sendTelegramNotification('pending');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      // For ABA payments
      else if (paymentMethod === "aba") {
        await sendTelegramNotification('completed');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      navigate('/payment-success', {
        state: { 
          transactionId, 
          amount: total, 
          paymentMethod 
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = { billing: {}, card: {}, khqr: {}, aba: {} };
    let isValid = true;

    // Billing validation
    if (!billingAddress.firstName.trim()) {
      errors.billing.firstName = "First name is required";
      isValid = false;
    }
    if (!billingAddress.lastName.trim()) {
      errors.billing.lastName = "Last name is required";
      isValid = false;
    }
    if (!billingAddress.email.trim()) {
      errors.billing.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(billingAddress.email)) {
      errors.billing.email = "Email is invalid";
      isValid = false;
    }
    if (!billingAddress.address.trim()) {
      errors.billing.address = "Address is required";
      isValid = false;
    }
    if (!billingAddress.city.trim()) {
      errors.billing.city = "City is required";
      isValid = false;
    }
    if (!billingAddress.state) {
      errors.billing.state = "State is required";
      isValid = false;
    }
    if (!billingAddress.zipCode.trim()) {
      errors.billing.zipCode = "ZIP code is required";
      isValid = false;
    }
    if (!billingAddress.country) {
      errors.billing.country = "Country is required";
      isValid = false;
    }

    // Payment method specific validation
    if (paymentMethod === "card") {
      const cardNumber = document.getElementById('cardNumber')?.value?.replace(/\s/g, '');
      if (!cardNumber || cardNumber.length < 16) {
        errors.card.cardNumber = "Valid card number is required";
        isValid = false;
      }
      if (!document.getElementById('expiry')?.value?.trim()) {
        errors.card.expiry = "Expiry date is required";
        isValid = false;
      }
      if (!document.getElementById('cvc')?.value?.trim() || document.getElementById('cvc')?.value?.length < 3) {
        errors.card.cvc = "Valid CVC is required";
        isValid = false;
      }
      if (!document.getElementById('cardName')?.value?.trim()) {
        errors.card.cardName = "Name on card is required";
        isValid = false;
      }
    } else if (paymentMethod === "aba") {
      if (!document.getElementById('abaPhone')?.value?.trim()) {
        errors.aba.abaPhone = "Phone number is required";
        isValid = false;
      }
      if (!document.getElementById('abaPin')?.value?.trim() || document.getElementById('abaPin')?.value?.length !== 4) {
        errors.aba.abaPin = "Valid 4-digit PIN is required";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase safely and securely</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod} 
                  className="grid grid-cols-1 gap-4"
                >
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="khqr" id="khqr" className="peer sr-only" />
                    <Label
                      htmlFor="khqr"
                      className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <QrCode className="h-5 w-5" />
                        <div>
                          <div className="font-medium">KHQR</div>
                          <div className="text-sm text-muted-foreground">Scan QR code to pay</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="aba" id="aba" className="peer sr-only" />
                    <Label
                      htmlFor="aba"
                      className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5" />
                        <div>
                          <div className="font-medium">ABA Mobile</div>
                          <div className="text-sm text-muted-foreground">Pay with ABA Mobile Banking</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Information</CardTitle>
                  <CardDescription>Enter your card details securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      className={formErrors.card.cardNumber ? "border-red-500" : ""}
                    />
                    {formErrors.card.cardNumber && (
                      <p className="text-sm text-red-500">{formErrors.card.cardNumber}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        className={formErrors.card.expiry ? "border-red-500" : ""}
                      />
                      {formErrors.card.expiry && (
                        <p className="text-sm text-red-500">{formErrors.card.expiry}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        placeholder="123" 
                        className={formErrors.card.cvc ? "border-red-500" : ""}
                      />
                      {formErrors.card.cvc && (
                        <p className="text-sm text-red-500">{formErrors.card.cvc}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      className={formErrors.card.cardName ? "border-red-500" : ""}
                    />
                    {formErrors.card.cardName && (
                      <p className="text-sm text-red-500">{formErrors.card.cardName}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* KHQR Payment */}
            {paymentMethod === "khqr" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    KHQR Payment
                  </CardTitle>
                  <CardDescription>
                    Scan the QR code with your banking app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <img 
                      src="/images/my-qr-code.jpg"
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-contain mb-4"
                    />
                    <p className="text-center text-sm text-muted-foreground mb-2">
                      Scan this QR code with your mobile banking app
                    </p>
                    <p className="text-center font-medium">
                      Amount: ${total.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="khqrPhone">Phone Number (Optional)</Label>
                    <Input id="khqrPhone" placeholder="+855 12 345 678" />
                    <p className="text-xs text-muted-foreground">Enter your phone number for payment confirmation</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ABA Mobile Payment */}
            {paymentMethod === "aba" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    ABA Mobile Payment
                  </CardTitle>
                  <CardDescription>Pay using ABA Mobile Banking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="abaPhone">ABA Mobile Phone Number</Label>
                    <Input 
                      id="abaPhone" 
                      placeholder="+855 12 345 678" 
                      className={formErrors.aba.abaPhone ? "border-red-500" : ""}
                    />
                    {formErrors.aba.abaPhone && (
                      <p className="text-sm text-red-500">{formErrors.aba.abaPhone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abaPin">ABA PIN (Last 4 digits)</Label>
                    <Input 
                      id="abaPin" 
                      type="password" 
                      placeholder="****" 
                      maxLength={4} 
                      className={formErrors.aba.abaPin ? "border-red-500" : ""}
                    />
                    {formErrors.aba.abaPin && (
                      <p className="text-sm text-red-500">{formErrors.aba.abaPin}</p>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">How to pay with ABA Mobile:</h4>
                        <ol className="text-sm text-blue-800 mt-2 space-y-1">
                          <li>1. Enter your ABA Mobile registered phone number</li>
                          <li>2. Enter the last 4 digits of your ABA PIN</li>
                          <li>3. You'll receive an SMS to confirm the payment</li>
                          <li>4. Follow the instructions in the SMS to complete</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Enter your billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={billingAddress.firstName}
                      onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
                      className={formErrors.billing.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.billing.firstName && (
                      <p className="text-sm text-red-500">{formErrors.billing.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={billingAddress.lastName}
                      onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
                      className={formErrors.billing.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.billing.lastName && (
                      <p className="text-sm text-red-500">{formErrors.billing.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={billingAddress.email}
                    onChange={(e) => setBillingAddress({...billingAddress, email: e.target.value})}
                    className={formErrors.billing.email ? "border-red-500" : ""}
                  />
                  {formErrors.billing.email && (
                    <p className="text-sm text-red-500">{formErrors.billing.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Main Street" 
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                    className={formErrors.billing.address ? "border-red-500" : ""}
                  />
                  {formErrors.billing.address && (
                    <p className="text-sm text-red-500">{formErrors.billing.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="New York" 
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                      className={formErrors.billing.city ? "border-red-500" : ""}
                    />
                    {formErrors.billing.city && (
                      <p className="text-sm text-red-500">{formErrors.billing.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={billingAddress.state}
                      onValueChange={(value) => setBillingAddress({...billingAddress, state: value})}
                    >
                      <SelectTrigger className={formErrors.billing.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.billing.state && (
                      <p className="text-sm text-red-500">{formErrors.billing.state}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode" 
                      placeholder="10001" 
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                      className={formErrors.billing.zipCode ? "border-red-500" : ""}
                    />
                    {formErrors.billing.zipCode && (
                      <p className="text-sm text-red-500">{formErrors.billing.zipCode}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={billingAddress.country}
                      onValueChange={(value) => setBillingAddress({...billingAddress, country: value})}
                    >
                      <SelectTrigger className={formErrors.billing.country ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.billing.country && (
                      <p className="text-sm text-red-500">{formErrors.billing.country}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your purchase details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Trust
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Secure payment processing</span>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Complete Payment */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={isTermsAccepted}
                    onCheckedChange={(checked) => setIsTermsAccepted(checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={processPayment}
                  disabled={isLoading || !isTermsAccepted}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Complete Payment - $${total.toFixed(2)}`
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Your payment information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}