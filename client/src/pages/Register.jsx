import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { registerUser } from '../services/api';
import { Rocket, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // const dispatch = useDispatch(); // Removing Redux per user preference for Context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data } = await registerUser(formData);

            // In a real app with Redux: dispatch(setCredentials(data));
            // For now, assuming direct login or redirect to login
            localStorage.setItem('token', data.token);
            // navigate('/dashboard'); 
            // Or better, let them login or auto-login. Let's auto-login via window reload or context update
            window.location.href = '/dashboard';

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                        <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-text mb-2 tracking-tight">Create Account</h1>
                    <p className="text-muted">Start your paper trading journey today</p>
                </div>

                {/* Register Card */}
                <div className="bg-surface border border-border rounded-xl p-8 shadow-xl relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-primary/10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -ml-12 -mb-12 transition-all duration-700 group-hover:bg-accent/10"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Username</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-muted transition-colors group-hover/input:text-primary" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe"
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-12 pr-4 text-text placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted transition-colors group-hover/input:text-primary" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-12 pr-4 text-text placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted transition-colors group-hover/input:text-primary" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-12 pr-4 text-text placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted transition-colors group-hover/input:text-primary" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-12 pr-4 text-text placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <p className="text-muted text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
