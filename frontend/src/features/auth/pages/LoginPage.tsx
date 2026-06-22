import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-2">
          Login
        </h1>

        <p className="text-muted-foreground mb-6">
          Welcome back to ContentCrew
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <Label>Email</Label>

            <Input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Password</Label>

            <Input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          No account?

          <Link
            to="/signup"
            className="ml-1 underline"
          >
            Signup
          </Link>
        </p>
      </Card>
    </div>
  );
}