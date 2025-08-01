import { useLocation } from 'react-router-dom';
import { CheckCircle, Printer } from 'lucide-react';

export default function PaymentSuccess() {
  const { state } = useLocation();
  
  // Handle print receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 print:p-0">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center print:shadow-none">
        <CheckCircle 
          className="h-16 w-16 text-green-500 mx-auto mb-4" 
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span>{state?.transactionId || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount Paid:</span>
            <span>${state?.amount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Method:</span>
            <span>{state?.paymentMethod ? state.paymentMethod.toUpperCase() : 'Unknown'}</span>
          </div>
          
          {state?.paymentMethod === 'khqr' && (
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-green-600">QR payment verified successfully!</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return Home
          </a>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors print:hidden"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}