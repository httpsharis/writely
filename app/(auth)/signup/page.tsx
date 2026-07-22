"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutation, useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { getErrorMessage } from "@/lib/errors";
import { AuthLayout } from "@/components/auth/authLayout";
import { AuthInput } from "@/components/auth/authInput";
import { OrDivider } from "@/components/auth/orDivider";
import { SubmitButton } from "@/components/auth/submitButton";

const GoogleLoginButton = dynamic(
  () => import("@/components/shared/googleLoginButton").then((mod) => mod.GoogleLoginButton),
  { ssr: false, loading: () => <div className="h-[44px] w-[300px] bg-muted animate-pulse rounded-md" /> }
);

interface SignupForm {
  name: string;
  username: string;
  email: string;
  password: string;
}

const INITIAL_FORM: SignupForm = { name: "", username: "", email: "", password: "" };

/**
 * /signup — email/password and Google OAuth registration.
 * Redirects to /inbox once either method succeeds.
 */
export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);

  const [googleLogin, { isLoading: isGoogleLoading, isSuccess: isGoogleSuccess, isError: isGoogleError }] =
    useGoogleLoginMutation();
  const [emailRegister, { isLoading: isEmailLoading, isSuccess: isEmailSuccess, error: emailError }] =
    useRegisterMutation();

  const isSuccess = isGoogleSuccess || isEmailSuccess;
  useAuthRedirect(isSuccess);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGoogleSuccess = ({ credential }: CredentialResponse) =>
    credential && googleLogin({ idToken: credential }).unwrap().catch(console.error);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isComplete = Object.values(form).every(Boolean);
    if (isComplete) emailRegister(form).unwrap().catch(console.error);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join Writely and start crafting your world"
      isSuccess={isSuccess}
      successMessage="Welcome to Writely! Redirecting you..."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Austen" required />
        <AuthInput label="Username" name="username" value={form.username} onChange={handleChange} placeholder="janeausten" required />
        <AuthInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="author@writely.com" required />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          minLength={6}
        />

        {emailError && (
          <p className="text-xs font-medium text-red-500 text-center">
            {getErrorMessage(emailError, "Registration failed. Please try again.")}
          </p>
        )}

        <SubmitButton isLoading={isEmailLoading} label="Sign Up" />
      </form>

      <OrDivider />

      <div className="w-full flex flex-col items-center gap-4">
        <GoogleLoginButton onSuccess={handleGoogleSuccess} isLoading={isGoogleLoading || isEmailLoading} />
      </div>

      {isGoogleError && (
        <p className="text-sm text-red-500 mt-4 text-center">Google signup failed. Please try again.</p>
      )}

      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground hover:text-brand font-bold transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
