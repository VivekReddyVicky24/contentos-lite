import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          ContentCrew Dashboard
        </h1>

        <LogoutButton />
      </div>
    </div>
  );
}