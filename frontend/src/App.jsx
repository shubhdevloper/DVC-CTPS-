import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RecordIncomingPage from "./pages/RecordIncomingPage";
import RecordOutgoingPage from "./pages/RecordOutgoingPage";
import MyRecords from "./pages/MyRecords";
import IncomingPage from "./pages/IncomingPage";
import OutgoingPage from "./pages/OutgoingPage";
import VerifyPage from "./pages/VerifyPage";
import UsersPage from "./pages/UsersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import QuickLinksPage from "./pages/QuickLinksPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/" element={<LoginPage />} />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* Protected Layout */}

      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/record-incoming"
          element={<RecordIncomingPage />}
        />

        <Route
          path="/record-outgoing"
          element={<RecordOutgoingPage />}
        />
              <Route
        path="/my-records"
        element={<MyRecords />}
      />
       <Route
          path="/manage-users"
          element={<UsersPage />}
        />
        <Route
          path="/incoming-register"
          element={<IncomingPage />}
        />

        <Route
          path="/outgoing-register"
          element={<OutgoingPage />}
        /> 
        <Route
          path="/verify-reject"
          element={<VerifyPage />}
        />
        <Route
          path="/quick-links"
          element={<QuickLinksPage />}
        />
        <Route
  path="/announcements"
  element={<AnnouncementsPage />}
/>
      </Route>

    </Routes>
  );
}
export default App;