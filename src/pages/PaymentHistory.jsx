import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import '../CssPages/BookingConfirmation.css';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    paymentService.getMine().then((data) => {
      if (active) setPayments(Array.isArray(data) ? data : []);
    }).catch((e) => { if (active) setError(e.message || 'Could not load payment history.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return (
    <main className="booking-confirmation">
      <div className="booking-card" style={{ maxWidth: 1000, width: '100%' }}>
        <h1>Payment History</h1>
        <p className="booking-subtitle">Your lesson payments and platform transaction references.</p>
        {loading && <p>Loading payments…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && payments.length === 0 && <p>No payments yet. Once you create a lesson booking, you can pay securely with Chapa.</p>}
        {payments.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr>{['Date','Tutor / Student','Lesson','Amount','Status','Reference'].map((x) => <th key={x} style={{ padding: 10, borderBottom: '1px solid #ddd' }}>{x}</th>)}</tr></thead>
              <tbody>{payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{p.tutor_name || p.student_name || 'Tutor Connect'}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{p.subject || 'Lesson'}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{Number(p.amount).toLocaleString()} {p.currency}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{p.status}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee', overflowWrap: 'anywhere' }}>{p.merchant_reference}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="booking-actions">
          <button className="booking-btn" type="button" onClick={() => window.print()}>Print / Save Receipt</button>
          <Link className="booking-btn secondary" to="/guardian-dashboard">Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
