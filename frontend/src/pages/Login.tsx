import React from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { login } from '@/api/auth';
import toast from 'react-hot-toast';
import { AxiosError } from "axios"
import { useNavigate } from 'react-router-dom';


export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setIsLoading(true)

        try {
            const result = await login({ email, password })
            toast.success(result.message)
            navigate('/')
        } catch (error) {
            const axiosError = error as AxiosError
            setError(axiosError.message)
        } finally { 
            setIsLoading(false)
        }
    };
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 md:p-8">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:p-8">
                <div className="flex flex-col items-center justify-center space-y-2 mb-6">
                <div className="rounded-full bg-blue-100 p-3">
                    <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
                <div className="flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    <p className="text-sm font-medium text-gray-500">Restricted Access</p>
                </div>
                </div>

                {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Admin Email
                    </label>
                    <input
                    id="username"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="admin_username"
                    required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Admin Password
                    </label>
                    <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="••••••••"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                        ) : (
                        <Eye className="h-5 w-5" />
                        )}
                    </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                        Remember device
                    </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                >
                    {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
                </button>
                </form>

                <div className="mt-6">
                <p className="text-center text-sm text-gray-600">
                    <span className="block sm:inline">Unauthorized access is prohibited.</span>
                    <span className="block sm:inline mt-1 sm:mt-0 sm:ml-1">Contact <a href="#" className="font-medium text-blue-600 hover:text-blue-500">IT Security</a> for access.</span>
                </p>
                </div>
            </div>
        </div>
    );
}