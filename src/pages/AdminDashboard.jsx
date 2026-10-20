import { useState, useEffect, useCallback } from 'react';
import { tutorService } from '../services/tutorService';
import { supportService } from '../services/supportService';
import { useBookings } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
import { paymentService } from '../services/paymentService';
import '../CssPages/AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { bookings, updateBookingStatus } = useBookings();
  const { addToast } = useNotification();

  const [tutors, setTutors] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: 'Abel Bekele', role: 'Learner', status: 'Active' },
    { id: 2, name: 'Sara Bekele', role: 'Learner', status: 'Active' },
    { id: 3, name: 'Dawit Alemu', role: 'Tutor', status: 'Active' },
    { id: 4, name: 'Hanna Tesfaye', role: 'Tutor', status: 'Active' },
    { id: 5, name: 'Biruk Tadesse', role: 'Tutor', status: 'Active' },
  ]);

  const [reports, setReports] = useState(() => supportService.getReports());
  const [inquiries, setInquiries] = useState(() => supportService.getInquiries());
  const [notice, setNotice] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [paymentLoadError, setPaymentLoadError] = useState('');

  const loadTutors = useCallback(async () => {
    const list = await tutorService.getAllTutors();
    setTutors(list);
  }, []);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  useEffect(() => {
    if (activeTab !== 'payments') return;
    paymentService.getAdminSummary()
      .then((data) => { setPaymentData(data); setPaymentLoadError(''); })
      .catch((error) => setPaymentLoadError(error.message || 'Could not load payment records. Sign in with a real admin account and ensure the migration has run.'));
  }, [activeTab]);

  async function handleVerifyTutor(id, approved) {
    const status = approved ? 'Verified' : 'Rejected';
    await tutorService.verifyTutor(id, status);
    await loadTutors();

    const tutor = tutors.find((t) => t.id === id);
    const msg = `${tutor?.name || 'Tutor'}'s application was ${approved ? 'approved' : 'rejected'}.`;
    setNotice(msg);
    addToast(msg, approved ? 'success' : 'info');
  }

  function toggleUser(id) {
    const user = users.find((item) => item.id === id);
    if (!user) return;

    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';

    setUsers((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    const msg = `${user.name}'s account is now ${newStatus.toLowerCase()}.`;
    setNotice(msg);
    addToast(msg, 'info');
  }

  async function handleUpdateBooking(id, status) {
    await updateBookingStatus(id, status);
    const msg = `Booking #${id.slice(-4)} marked as ${status.toLowerCase()}.`;
    setNotice(msg);
    addToast(msg, 'info');
  }

  function handleResolveReport(id) {
    const updated = supportService.resolveReport(id);
    setReports(updated);
    addToast('Report marked as resolved.', 'success');
  }

  function handleResolveInquiry(id) {
    const updated = supportService.resolveInquiry(id);
    setInquiries(updated);
    addToast('Contact inquiry resolved.', 'success');
  }

  const pendingTutors = tutors.filter((t) => !t.verified);
  const activeBookings = bookings.filter(
    (b) => b.status === 'Pending' || b.status === 'Confirmed'
  );

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>TutorConnect</h2>
        <p className="admin-sidebar-label">ADMINISTRATION</p>

        {[
          ['overview', 'Overview'],
          ['tutors', `Tutor Verification (${pendingTutors.length})`],
          ['users', 'User Management'],
          ['bookings', `All Bookings (${bookings.length})`],
          ['payments', 'Payments & Revenue'],
          ['inquiries', `Support Inquiries (${inquiries.filter((i) => i.status === 'Open').length})`],
          ['reports', `Reports (${reports.filter((r) => r.status === 'Open').length})`],
          ['settings', 'Platform Settings'],
        ].map(([tab, label]) => (
          <button
            key={tab}
            className={activeTab === tab ? 'admin-nav active' : 'admin-nav'}
            onClick={() => {
              setActiveTab(tab);
              setNotice('');
            }}
          >
            {label}
          </button>
        ))}
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">PLATFORM ADMINISTRATION</p>
            <h1>
              {activeTab === 'overview' && 'Admin Overview'}
              {activeTab === 'tutors' && 'Tutor Applications & Verification'}
              {activeTab === 'users' && 'User Account Management'}
              {activeTab === 'bookings' && 'Booking Management'}
              {activeTab === 'payments' && 'Payments & Revenue'}
              {activeTab === 'inquiries' && 'Contact & Support Inquiries'}
              {activeTab === 'reports' && 'Complaints & Incident Reports'}
              {activeTab === 'settings' && 'Platform Settings'}
            </h1>
            <p>Monitor, verify tutors, and oversee the TutorConnect platform.</p>
          </div>
          <div className="admin-avatar">AD</div>
        </header>

        {notice && (
          <div className="admin-notice" role="status">
            {notice}
            <button onClick={() => setNotice('')}>Dismiss</button>
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <section className="admin-welcome">
              <p>ADMINISTRATOR WORKSPACE</p>
              <h2>Welcome to TutorConnect administration.</h2>
              <span>
                Review applications, monitor bookings, resolve complaints, and support users.
              </span>
            </section>

            <section className="admin-stats">
              <article className="admin-stat">
                <span>Total Users</span>
                <h2>{users.length}</h2>
                <p>Learners & tutors</p>
              </article>
              <article className="admin-stat">
                <span>Verified Tutors</span>
                <h2>{tutors.filter((t) => t.verified).length}</h2>
                <p>Approved profiles</p>
              </article>
              <article className="admin-stat">
                <span>Pending Approvals</span>
                <h2>{pendingTutors.length}</h2>
                <p>Requires admin review</p>
              </article>
              <article className="admin-stat">
                <span>Active Bookings</span>
                <h2>{activeBookings.length}</h2>
                <p>Pending or confirmed</p>
              </article>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Pending Tutor Applications</h2>
                  <p>Tutors awaiting background and credential verification.</p>
                </div>
                <button onClick={() => setActiveTab('tutors')}>View all ({pendingTutors.length})</button>
              </div>

              {pendingTutors.length === 0 ? (
                <p className="admin-empty">No applications currently awaiting review.</p>
              ) : (
                pendingTutors.map((tutor) => (
                  <article className="admin-list-row" key={tutor.id}>
                    <div className="admin-row-info">
                      <h3>{tutor.name}</h3>
                      <p>
                        Subjects: {(tutor.subjects || []).join(', ')} · Rate: {tutor.price} ETB
                      </p>
                    </div>
                    <div className="admin-actions">
                      <button
                        className="admin-approve"
                        onClick={() => handleVerifyTutor(tutor.id, true)}
                      >
                        Approve & Verify
                      </button>
                      <button
                        className="admin-reject"
                        onClick={() => handleVerifyTutor(tutor.id, false)}
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Recent Platform Bookings</h2>
                  <p>All active sessions across tutors and learners.</p>
                </div>
                <button onClick={() => setActiveTab('bookings')}>
                  View all ({bookings.length})
                </button>
              </div>

              {bookings.slice(0, 4).map((booking) => (
                <article className="admin-list-row" key={booking.id}>
                  <div className="admin-row-info">
                    <h3>{booking.subject} ({booking.mode})</h3>
                    <p>
                      {booking.learnerName} with {booking.tutorName} · {booking.date} at {booking.time}
                    </p>
                  </div>
                  <span
                    className={`admin-status ${booking.status?.toLowerCase() || 'pending'}`}
                  >
                    {booking.status}
                  </span>
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === 'tutors' && (
          <section className="admin-panel">
            <h2>Tutor Applications & Verification</h2>
            <p>Review credentials and verify or revoke verification badges.</p>

            {tutors.map((tutor) => (
              <article className="admin-list-row" key={tutor.id}>
                <div className="admin-row-info">
                  <h3>
                    {tutor.name}{' '}
                    {tutor.verified ? (
                      <span className="admin-status verified">✓ Verified</span>
                    ) : (
                      <span className="admin-status pending">Pending Review</span>
                    )}
                  </h3>
                  <p>
                    {(tutor.subjects || []).join(', ')} · {tutor.price} ETB/hr · {tutor.experience} yrs exp
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Credentials: {(tutor.qualifications || []).join(' | ')}
                  </p>
                </div>

                <div className="admin-actions">
                  {!tutor.verified ? (
                    <>
                      <button
                        className="admin-approve"
                        onClick={() => handleVerifyTutor(tutor.id, true)}
                      >
                        Verify Tutor ✓
                      </button>
                      <button
                        className="admin-reject"
                        onClick={() => handleVerifyTutor(tutor.id, false)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      className="admin-reject"
                      onClick={() => handleVerifyTutor(tutor.id, false)}
                    >
                      Revoke Verification
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {activeTab === 'users' && (
          <section className="admin-panel">
            <h2>User Account Management</h2>
            <p>Oversee registered learner and tutor accounts.</p>

            {users.map((user) => (
              <article className="admin-list-row" key={user.id}>
                <div className="admin-row-info">
                  <h3>{user.name}</h3>
                  <p>Role: {user.role}</p>
                  <span className={`admin-status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                <button
                  className={
                    user.status === 'Active' ? 'admin-reject' : 'admin-approve'
                  }
                  onClick={() => toggleUser(user.id)}
                >
                  {user.status === 'Active' ? 'Suspend Account' : 'Reactivate'}
                </button>
              </article>
            ))}
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="admin-panel">
            <h2>All Platform Bookings</h2>
            <p>Manage lesson progress and dispute resolutions.</p>

            {bookings.map((booking) => (
              <article className="admin-list-row" key={booking.id}>
                <div className="admin-row-info">
                  <h3>{booking.subject} · {booking.total} ETB</h3>
                  <p>
                    Student: {booking.learnerName} · Tutor: {booking.tutorName}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Date: {booking.date} · Time: {booking.time} · Mode: {booking.mode}
                  </p>
                  <span className={`admin-status ${booking.status?.toLowerCase() || 'pending'}`}>
                    {booking.status}
                  </span>
                </div>

                {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                  <div className="admin-actions">
                    <button
                      className="admin-approve"
                      onClick={() => handleUpdateBooking(booking.id, 'Completed')}
                    >
                      Mark Complete
                    </button>
                    <button
                      className="admin-reject"
                      onClick={() => handleUpdateBooking(booking.id, 'Cancelled')}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {activeTab === 'inquiries' && (
          <section className="admin-panel">
            <h2>Customer Support Inquiries</h2>
            <p>Messages submitted through the public Contact page.</p>

            {inquiries.length === 0 ? (
              <p className="admin-empty">No support inquiries.</p>
            ) : (
              inquiries.map((inq) => (
                <article className="admin-list-row" key={inq.id}>
                  <div className="admin-row-info">
                    <h3>
                      [{inq.ticketNumber}] {inq.name} ({inq.email})
                    </h3>
                    <p style={{ fontWeight: 600, color: '#2563eb' }}>
                      Topic: {inq.subjectLabel || inq.subject}
                    </p>
                    <p style={{ margin: '6px 0', color: '#334155' }}>"{inq.message}"</p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Submitted: {inq.date} · Status: {inq.status}
                    </span>
                  </div>

                  {inq.status === 'Open' && (
                    <button
                      className="admin-approve"
                      onClick={() => handleResolveInquiry(inq.id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="admin-panel">
            <h2>Complaints & Incident Reports</h2>
            <p>Review reported reviews and user incident submissions.</p>

            {reports.map((report) => (
              <article className="admin-list-row" key={report.id}>
                <div className="admin-row-info">
                  <h3>{report.title}</h3>
                  <p>Reported by: {report.submittedBy}</p>
                  {report.details && (
                    <p style={{ margin: '4px 0', color: '#475569' }}>"{report.details}"</p>
                  )}
                  <span className={`admin-status ${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
                </div>
                {report.status === 'Open' && (
                  <button
                    className="admin-approve"
                    onClick={() => handleResolveReport(report.id)}
                  >
                    Mark Resolved
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        {activeTab === 'payments' && (
          <section className="admin-panel">
            <h2>Payment and commission overview</h2>
            <p>Values are loaded from verified backend payment records, not browser demo data.</p>
            {paymentLoadError && <div className="admin-notice" role="alert">{paymentLoadError}</div>}
            {paymentData && (
              <>
                <section className="admin-stats">
                  <article className="admin-stat"><span>Gross verified revenue</span><h2>{Number(paymentData.summary?.gross_revenue || 0).toLocaleString()} ETB</h2></article>
                  <article className="admin-stat"><span>Platform commission</span><h2>{Number(paymentData.summary?.platform_commission || 0).toLocaleString()} ETB</h2></article>
                  <article className="admin-stat"><span>Tutor earnings</span><h2>{Number(paymentData.summary?.tutor_earnings || 0).toLocaleString()} ETB</h2></article>
                  <article className="admin-stat"><span>Pending payments</span><h2>{paymentData.summary?.pending_payments || 0}</h2></article>
                </section>
                <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead><tr><th>Reference</th><th>Student</th><th>Tutor</th><th>Lesson</th><th>Amount</th><th>Commission</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>{(paymentData.payments || []).map((p) => (
                      <tr key={p.id}><td>{p.merchant_reference}</td><td>{p.student_name}</td><td>{p.tutor_name}</td><td>{p.subject || 'Lesson'}</td><td>{Number(p.amount).toLocaleString()} {p.currency}</td><td>{Number(p.platform_commission).toLocaleString()} ETB</td><td><span className={`admin-status ${p.status}`}>{p.status}</span></td><td>{new Date(p.created_at).toLocaleDateString()}</td></tr>
                    ))}</tbody>
                  </table>
                  {!paymentData.payments?.length && <p>No payment records yet.</p>}
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="admin-panel">
            <h2>Platform Settings & Backend Integration</h2>
            <p>
              When your backend folder is connected, the API client at <code>src/services/apiClient.js</code> automatically targets your active API endpoints.
            </p>
            <div className="admin-setting-row">
              <div>
                <h3>Backend API URL</h3>
                <p>Default: <code>http://localhost:3000/api</code> (or configure <code>VITE_API_URL</code>)</p>
              </div>
              <span className="admin-status verified">Configured</span>
            </div>
            <div className="admin-setting-row">
              <div>
                <h3>Offline / Local Storage Fallback</h3>
                <p>Stores data persistently in browser localStorage whenever backend is disconnected.</p>
              </div>
              <span className="admin-status verified">Active</span>
            </div>
            <div className="admin-setting-row">
              <div>
                <h3>Tutor Verification Rules</h3>
                <p>New tutor registrations start as pending until verified by admin.</p>
              </div>
              <span className="admin-status verified">Active</span>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
