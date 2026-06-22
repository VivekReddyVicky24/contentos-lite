import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  signupSchema,
  type SignupFormData,
} from "../schemas/authSchema";

import { signUp } from "../services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (
    values: SignupFormData
  ) => {
    try {
      setLoading(true);

      await signUp(
        values.email,
        values.password,
        values.fullName
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">
            Create Account
          </h1>

          <p className="text-sm text-muted-foreground">
            Welcome to ContentCrew
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label>
              Full Name
            </Label>

            <Input
              {...register("fullName")}
            />

            <p className="text-red-500 text-sm">
              {errors.fullName?.message}
            </p>
          </div>

          <div>
            <Label>
              Email
            </Label>

            <Input
              {...register("email")}
            />

            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <Label>
              Password
            </Label>

            <Input
              type="password"
              {...register("password")}
            />

            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>

          <Button
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center">
          Already have an account?

          <Link
            to="/login"
            className="ml-1 underline"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}