import React from "react";
import PrivateRoute from "../routes/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DashboardLayout from "../layouts/DashboardLayout";
import Evaluations from "../pages/Evaluations";
import EmployeeManagement from "../pages/EmployeeManagement";
import Profile from "../pages/Profile";
import RoleManagement from "../pages/RoleManagement";
import ProjectManagement from "../pages/ProjectManagement";
import GroupManagement from "../pages/GroupManagement";
import GroupMembers from "../pages/GroupMembers";
import AdminEvaluation from "../pages/AdminEvaluation";
import UserEvaluation from "../pages/UserEvaluation";
import EvaluationPeriodManagement from "../pages/EvaluationPeriodManagement";
import EvaluationTemplateManagement from "../pages/EvaluationTemplateManagement";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import GroupMembersPage from "../pages/GroupMembersPage";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="" element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route
            path="/group-members-page"
            element={
              <PrivateRoute role="Leader">
                <GroupMembersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee-management"
            element={
              <PrivateRoute role="Admin">
                <EmployeeManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/role-management"
            element={
              <PrivateRoute role="Admin">
                <RoleManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/project-management"
            element={
              <PrivateRoute role="Admin">
                <ProjectManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/group-management"
            element={
              <PrivateRoute role="Admin">
                <GroupManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin-evaluations"
            element={
              <PrivateRoute role="Admin">
                <AdminEvaluation />
              </PrivateRoute>
            }
          />
          <Route
            path="/evaluation-period-management"
            element={
              <PrivateRoute role="Admin">
                <EvaluationPeriodManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/evaluation-template-management"
            element={
              <PrivateRoute role="Admin">
                <EvaluationTemplateManagement />
              </PrivateRoute>
            }
          />
          <Route path="/user-evaluations" element={<UserEvaluation />} />

          <Route
            path="/group-management/:maNhom/members"
            element={<GroupMembers />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
