import AppRouter from "./app/AppRouter";

import {
  AuthProvider,
} from "@/features/auth/context/AuthContext";

import {
  WorkspaceProvider,
} from "@/features/workspace/context/WorkspaceContext";

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AppRouter />
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;