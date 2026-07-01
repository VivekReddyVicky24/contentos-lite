import { signOut } from "@/features/auth/services/authService";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex h-10 items-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
    >
      Logout
    </button>
  );
}
