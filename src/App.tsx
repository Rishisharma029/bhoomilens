import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecordsProvider } from './context/RecordsContext';
import { AppLayout } from './components/layout/AppLayout';
import { Navbar } from './components/common/Navbar';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { CitizenLoginPage } from './pages/auth/CitizenLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { MyRecordsPage } from './pages/citizen/MyRecordsPage';
import { RecordDetailsPage } from './pages/citizen/RecordDetailsPage';
import { UploadDocumentPage } from './pages/citizen/UploadDocumentPage';
import { ReviewExtractedPage } from './pages/citizen/ReviewExtractedPage';
import { CorrectionRequestPage } from './pages/citizen/CorrectionRequestPage';
import { DocumentHistoryPage } from './pages/citizen/DocumentHistoryPage';
import { SubmissionResultPage } from './pages/citizen/SubmissionResultPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VerificationQueuePage } from './pages/admin/VerificationQueuePage';
import { AdminRecordDetailsPage } from './pages/admin/AdminRecordDetailsPage';
import { AIValidationPage } from './pages/admin/AIValidationPage';
import { AuditHistoryPage } from './pages/admin/AuditHistoryPage';
import { AdminAllRecordsPage } from './pages/admin/AdminAllRecordsPage';
import { ConflictCenterPage } from './pages/admin/ConflictCenterPage';
import { CorrectionRequestsAdminPage } from './pages/admin/CorrectionRequestsAdminPage';
import { CorrectionReviewPage } from './pages/admin/CorrectionReviewPage';
import { DocumentRepositoryPage } from './pages/admin/DocumentRepositoryPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AuthProvider>
      <RecordsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages with Top Navbar */}
            <Route
              path="/"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <LandingPage />
                </div>
              }
            />
            <Route
              path="/auth/select-role"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <RoleSelectionPage />
                </div>
              }
            />
            <Route
              path="/auth/citizen/login"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <CitizenLoginPage />
                </div>
              }
            />
            <Route
              path="/auth/admin/login"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <AdminLoginPage />
                </div>
              }
            />

            {/* Authenticated Workspace with Sidebar */}
            <Route element={<AppLayout />}>
              {/* Citizen Workflow */}
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/records" element={<MyRecordsPage />} />
              <Route path="/citizen/records/:id" element={<RecordDetailsPage />} />
              <Route path="/citizen/upload" element={<UploadDocumentPage />} />
              <Route path="/citizen/review-extracted/:docId" element={<ReviewExtractedPage />} />
              <Route path="/citizen/correction-request/:docId" element={<CorrectionRequestPage />} />
              <Route path="/citizen/history" element={<DocumentHistoryPage />} />
              <Route path="/citizen/submission-success/:id" element={<SubmissionResultPage />} />
              <Route path="/citizen/submission-success" element={<SubmissionResultPage />} />

              {/* Admin Workflow */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/queue" element={<VerificationQueuePage />} />
              <Route path="/admin/records" element={<AdminAllRecordsPage />} />
              <Route path="/admin/records/:id" element={<AdminRecordDetailsPage />} />
              <Route path="/admin/records/:id/ai-validation" element={<AIValidationPage />} />
              <Route path="/admin/conflicts" element={<ConflictCenterPage />} />
              <Route path="/admin/corrections" element={<CorrectionRequestsAdminPage />} />
              <Route path="/admin/corrections/:id" element={<CorrectionReviewPage />} />
              <Route path="/admin/documents" element={<DocumentRepositoryPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/audit-history" element={<AuditHistoryPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RecordsProvider>
    </AuthProvider>
  );
}

export default App;
