import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import '../CssPages/BookingConfirmation.css';

export default function PaymentResult() {
  const [params] = useSearchParams();
  const reference = params.get('tx_ref');
  const [state, setState] = useState({ loading: true, status: 'pending', message: 'Verifying your payment securely with Chapa…' });

  useEffect(() => {
    let active = true;
    if (!reference) {
      setState({ loading: false, status: 'failed', message: 'No payment reference was provided.' });
      return () => { active = false; };
    }
    paymentService.verify(reference)
      .then((result) => {
        if (!active) return;
        const status = result.status || result.payment?.status || 'pending';
        setState({ loading: false, status, message: status === 'successful'
          ? 'Payment verified. Your receipt and payment history are now available.'
          : status === 'failed' ? 'The payment could not be verified as successful. Please check your payment history or contact support.'
          : status === 'cancelled' ? 'The payment was cancelled. You can return to your dashboard and try again.'
          : 'Chapa has not confirmed this payment yet. Check your payment history again shortly.' });
      })
      .catch((error) => {
        if (!active) return;
        setState({ loading: false, status: 'pending', message: error.message || 'Could not verify the payment right now. Do not pay again until you check payment history.' });
      });
    return () => { active = false; };
  }, [reference]);

  return (
    <main className="booking-confirmation">
      <div className="booking-card">
        <div className="booking-icon">{state.loading ? '…' : state.status === 'successful' ? '✓' : '!'}</div>
        <h1>{state.loading ? 'Verifying Payment' : state.status === 'successful' ? 'Payment Confirmed' : 'Payment Status'}</h1>
        <p className="booking-subtitle">{state.message}</p>
        {reference && <p className="booking-status">REFERENCE: {reference} · STATUS: {state.status.toUpperCase()}</p>}
        <div className="booking-actions">
          <Link to="/guardian-dashboard" className="booking-btn">Go to My Dashboard</Link>
          <Link to="/find-tutors" className="booking-btn secondary">Find Tutors</Link>
        </div>
      </div>
    </main>
  );
}
