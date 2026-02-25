import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Authentication } from "../api/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

export function meta() {
    return [
        { title: "Login | CPDO Zoning Management System" },
        { name: "description", content: "Sign in to your account" },
    ];
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useMutation({
        mutationFn: async (credentials: Record<string, string>) => await Authentication.login(credentials),
        onSuccess: (data) => {
            console.log("Logged in successfully:", data);
            // Usually you would redirect here using React Router's useNavigate.
            // e.g., navigate('/dashboard');
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="mb-4 text-green-700 bg-white p-2 rounded-full border">
                        {/* Logo placeholder. Actual SVGs or img src should be placed here */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 21 8-2V7L12 3 4 7v12z" /><path d="m12 21v-8" /><path d="M4 11l8-2 8 2" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-900 tracking-tight">CPDO Zoning Management<br />System</h2>
                    <p className="mt-2 text-sm text-gray-600 text-center">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-gray-800">Username or Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your username or email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-green-50 border-green-200 outline-none focus-visible:ring-green-500 rounded-md"
                            required
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <Label htmlFor="password" className="text-xs font-semibold text-gray-800">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-green-50 border-green-200 pr-10 outline-none focus-visible:ring-green-500 rounded-md"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" className="border-gray-300" />
                            <Label htmlFor="remember" className="text-xs font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember me
                            </Label>
                        </div>
                        <a href="#" className="font-semibold text-xs text-green-600 hover:text-green-500">
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-[#10B981] hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                {loginMutation.isError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                        Login failed. Please check your credentials.
                    </div>
                )}
            </div>
        </div>
    );
}
