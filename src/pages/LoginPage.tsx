import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.login(email, password);
            if (response.success) {
                onLogin(response.token);
                navigate('/');
            } else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-red-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-[440px] px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex p-5 rounded-3xl bg-card shadow-2xl mb-8 transform transition-all hover:scale-105 duration-500 border border-border/50">
                        <img
                            src="https://claritone.inspitetech.com/assets/logo.png"
                            alt="Claritone Logo"
                            className="h-10 w-auto dark:invert"
                        />
                    </div>
                </div>

                <Card className="border-border/40 bg-card/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden rounded-[2.5rem]">
                    <CardContent className="p-10">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                                Admin Portal
                            </h1>
                            <p className="text-muted-foreground mt-3 text-sm font-medium">
                                Sign in to manage your hearing care network
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="admin@claritone.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-14 bg-background/30 border-border/60 focus:border-red-500/50 focus:ring-red-500/20 rounded-2xl transition-all text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 pr-12 h-14 bg-background/30 border-border/60 focus:border-red-500/50 focus:ring-red-500/20 rounded-2xl transition-all text-base"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20 group transition-all active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                            <span className="tracking-wide">Authenticating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span className="tracking-wide">Sign In</span>
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 text-muted-foreground uppercase tracking-[0.2em] font-bold">
                        <span className="w-8 h-[1px] bg-border/50" />
                        Secure Access
                        <span className="w-8 h-[1px] bg-border/50" />
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-4 leading-relaxed">
                        © 2026 Claritone Hearing Aid Centre.<br />
                        All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
