"use client";

import { useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Auth/logo";
import { registerUser } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

// Define validation schema using Zod with username added
const signupSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be 20 characters or less"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Added reset function from useForm
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const showSuccessToast = () => {
      addToast({
        variant: "success",
        title: "Success!",
        description: "Your account has been created successfully.",
      });
    };

    const showErrorToast = (message = "Something went wrong. Please try again.") => {
      addToast({
        variant: "error",
        title: "Error!",
        description: message,
      });
    };

    try {
      await registerUser(data);
      console.log("Form submitted:", data);
      showSuccessToast();
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Signup error:", error);
      showErrorToast(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-950 text-white max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Logo className="h-12 w-12" />
        </div>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6800] to-purple-300">
          API Explorer
        </CardTitle>
        <CardDescription className="text-zinc-400">Create an account to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Username
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="johndoe"
                {...register("name")}
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FF6800] focus:ring-[#FF6800]"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FF6800] focus:ring-[#FF6800]"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="border-zinc-800 bg-zinc-900 text-white focus:border-[#FF6800] focus:ring-[#FF6800]"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-zinc-300">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                {...register("confirmPassword")}
                className="border-zinc-800 bg-zinc-900 text-white focus:border-[#FF6800] focus:ring-[#FF6800]"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF6800] hover:bg-[#E65C00] text-white transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-950 px-2 text-zinc-400">Or continue with</span>
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 hover:border-[#FF6800]"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 hover:border-[#FF6800]"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div> */}
          </div>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col space-y-2 border-t border-zinc-800 pt-4">
        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6800] hover:text-[#E65C00] font-medium transition-colors duration-200">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-zinc-500">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-zinc-400 hover:text-zinc-300 underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-zinc-400 hover:text-zinc-300 underline">
            Privacy Policy
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}