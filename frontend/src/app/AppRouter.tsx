import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import CreateWorkspacePage from "@/features/workspace/pages/CreateWorkspacePage";
import DashboardPage from "@/pages/DashboardPage";
import BrandBrainPage from "@/features/brand-brain/pages/BrandBrainPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import WorkspaceGuard from "@/routes/WorkspaceGuard";

import DocumentsPage from "@/features/documents/pages/DocumentsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/create-workspace" element={<CreateWorkspacePage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkspaceGuard>
                <DashboardPage />
              </WorkspaceGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <WorkspaceGuard>
                <DocumentsPage />
              </WorkspaceGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-brain"
          element={
            <ProtectedRoute>
              <WorkspaceGuard>
                <BrandBrainPage />
              </WorkspaceGuard>
            </ProtectedRoute>
          }
        />
      
      </Routes>
    </BrowserRouter>
  );
}