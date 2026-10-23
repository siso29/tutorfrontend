
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { verifyPayment } from '../services/paymentService.js';

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const { token } = useAuth();

  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Verifying your payment with Chapa...');
  const [payment, setPayment] = useState(null);

  const reference =
    searchParams.get('tx_ref') ||
    searchParams.get('trx_ref');

  useEffect(() => {
    let cancelled = false;

    async function checkPayment() {
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference was found in the return URL.');
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage(
          'Please sign in with the same account you used to start the payment, then return to this page.'
        );
        return;
      }

      try {
        const result = await verifyPayment(reference, token);

        if (cancelled) return;

        const paymentStatus = String(result.status || '').toLowerCase();

        setPayment(result.payment || null);

        if (paymentStatus === 'successful') {
          setStatus('success');
          setMessage('Your payment has been verified successfully.');
        } else if (
          paymentStatus === 'pending' ||
          paymentStatus === 'processing'
        ) {
          setStatus('pending');
          setMessage(
            'Your payment is still being processed. Please check again shortly.'
          );
        } else {
          setStatus('failed');
          setMessage(
            'Your payment has not been confirmed as successful. Please check your payment history before trying again.'
          );
        }
      } catch (error) {
        if (cancelled) return;

        setStatus('error');
        setMessage(
          error.message ||
            'We could not verify your payment. Please try again.'
        );
      }
    }

    checkPayment();

    return () => {
      cancelled = true;
    };
  }, [reference, token]);

  const heading = {
    checking: 'Checking your payment',
    success: 'Payment successful!',
    pending: 'Payment pending',
    failed: 'Payment not confirmed',
    error: 'Unable to verify payment',
  }[status];

  return (
    <main
      style={{
        maxWidth: '650px',
        margin: '60px auto',
        padding: '30px 20px',
        textAlign: 'center',
      }}
    >
      <h1>{heading}</h1>

      <p role="status" aria-live="polite">{message}</p>

      {status === 'success' && payment && (
        <div style={{ margin: '20px 0' }}>
          <p>
            Amount: {payment.amount} {payment.currency || 'ETB'}
          </p>
          <p>Reference: {payment.merchant_reference || reference}</p>
        </div>
      )}

      {status === 'checking' && <p>Please wait...</p>}

      {status === 'pending' && (
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Check Again
        </button>
      )}

      {status === 'error' && token && reference && (
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Verification Again
        </button>
      )}

      <p style={{ marginTop: '25px' }}>
        <Link to="/guardian-dashboard">Go to Student Dashboard</Link>
      </p>

      <p>
        <Link to="/">Return to Home</Link>
      </p>

      {!token && (
        <p>
          <Link to="/login">Sign In</Link>
        </p>
      )}
    </main>
  );
}

export default PaymentResult;
