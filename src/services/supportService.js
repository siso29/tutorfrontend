import { getStorage, setStorage } from './storage';
import { INITIAL_INQUIRIES, INITIAL_REPORTS } from './mockData';

const INQUIRIES_KEY = 'tutorConnectInquiries';
const REPORTS_KEY = 'tutorConnectReports';

export const supportService = {
  getInquiries() {
    return getStorage(INQUIRIES_KEY, INITIAL_INQUIRIES);
  },

  submitInquiry(data) {
    const inquiries = this.getInquiries();
    const newInquiry = {
      id: `inq-${Date.now()}`,
      ticketNumber: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      ...data,
    };

    const updated = [newInquiry, ...inquiries];
    setStorage(INQUIRIES_KEY, updated);
    return newInquiry;
  },

  resolveInquiry(id) {
    const inquiries = this.getInquiries();
    const updated = inquiries.map((item) =>
      item.id === id ? { ...item, status: 'Resolved' } : item
    );
    setStorage(INQUIRIES_KEY, updated);
    return updated;
  },

  getReports() {
    return getStorage(REPORTS_KEY, INITIAL_REPORTS);
  },

  submitReport(data) {
    const reports = this.getReports();
    const newReport = {
      id: `rep-${Date.now()}`,
      status: 'Open',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      ...data,
    };
    const updated = [newReport, ...reports];
    setStorage(REPORTS_KEY, updated);
    return newReport;
  },

  resolveReport(id) {
    const reports = this.getReports();
    const updated = reports.map((item) =>
      item.id === id ? { ...item, status: 'Resolved' } : item
    );
    setStorage(REPORTS_KEY, updated);
    return updated;
  },
};
