import { useState } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUserShield, FaLock } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setFormError(null);
    
    try {
      await loginMutation.mutateAsync(data);
      setLocation("/admin");
    } catch (error) {
      setFormError("Invalid username or password. Please try again.");
    }
  }

  // If user is already logged in, redirect to admin
  if (user) {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl bg-gray-800/40 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">
              Access the Astrz Combat Leaderboard admin panel
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaUserShield className="absolute left-3 top-3 text-gray-500" />
                        <Input
                          placeholder="Enter your username"
                          className="pl-10 bg-gray-900/60 border-gray-700"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-gray-500" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 bg-gray-900/60 border-gray-700"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formError && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-600"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="hidden md:block bg-gradient-to-tr from-purple-900 to-indigo-900 p-8 flex flex-col justify-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Astrz Combat Leaderboard</h2>
            <p className="mb-6 text-gray-200">
              Manage players, update rankings, and record matches through the
              secure admin panel.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-xs">
                  ✓
                </span>
                <span>Manage player profiles</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-xs">
                  ✓
                </span>
                <span>Record match results</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-xs">
                  ✓
                </span>
                <span>Update player rankings</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-xs">
                  ✓
                </span>
                <span>Manage retired players</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}