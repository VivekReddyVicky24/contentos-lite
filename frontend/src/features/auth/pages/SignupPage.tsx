import {
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

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
      toast.error("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

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
            From brand memory to publishing
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Build a content workspace that remembers your brand.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Upload source material, run the agent pipeline, score quality, and track performance.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          One workspace. Every content workflow.
        </p>
      </section>

      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Start here
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your profile row is created with your auth user.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>
                Full Name
              </Label>

              <Input
                autoComplete="name"
                {...register("fullName")}
              />

              <p className="min-h-5 text-sm text-rose-600">
                {errors.fullName?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Email
              </Label>

              <Input
                type="email"
                autoComplete="email"
                {...register("email")}
              />

              <p className="min-h-5 text-sm text-rose-600">
                {errors.email?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Password
              </Label>

              <Input
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />

              <p className="min-h-5 text-sm text-rose-600">
                {errors.password?.message}
              </p>
            </div>

            <Button
              className="w-full"
              disabled={loading}
            >
              <UserPlus className="size-4" />
              {loading
                ? "Creating account..."
                : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?

            <Link
              to="/login"
              className="ml-1 font-medium text-emerald-700 underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
