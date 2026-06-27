import AppRouter from "./app/AppRouter";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  AuthProvider,
} from "@/features/auth/context/AuthContext";

import {
  WorkspaceProvider,
} from "@/features/workspace/context/WorkspaceContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          <AppRouter />
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
