import {
  LogIn,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { signIn } from "../services/authService";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await signIn(
        email,
        password
      );

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-50 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:p-0">
      <section className="hidden min-h-screen flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-emerald-500 text-sm font-bold text-slate-950">
            CC
          </div>
          <span className="font-semibold">
            ContentCrew
          </span>
        </div>

        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-emerald-100">
            <Sparkles className="size-4" />
            Brand-grounded AI content operations
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Create, evaluate, and publish content from one calm workspace.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Keep brand memory, documents, agent workflows, quality scoring, and analytics connected.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          Built for repeatable content systems.
        </p>
      </section>

      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Login
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Continue to your ContentCrew workspace.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              className="w-full"
              disabled={loading}
            >
              <LogIn className="size-4" />
              {loading
                ? "Signing in..."
                : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            No account?

            <Link
              to="/signup"
              className="ml-1 font-medium text-emerald-700 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
