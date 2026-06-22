import { signOut } from "@/features/auth/services/authService";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}