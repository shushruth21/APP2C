import React, { useState } from 'react';
import { ArrowRight, User, Users, Eye, EyeOff, Phone, Mail, Lock, UserCheck, Settings, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';

interface EnhancedLoginPageProps {
  onSuccess: () => void;
}

export const EnhancedLoginPage: React.FC<EnhancedLoginPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<'customer' | 'staff'>('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters';
      }

      if (userType === 'customer') {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.fullName, formData.phone);
      }
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('estre-remember', JSON.stringify({
          email: formData.email,
          userType,
        }));
      }
      
      onSuccess();
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Authentication failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-forest-900/10 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Mobile/Tablet: Single Card Layout */}
          <div className="lg:hidden">
            <div className="bg-ivory-white/95 backdrop-blur-md rounded-2xl border border-gold-500/30 shadow-luxury-lg overflow-hidden">
              {/* Header */}
              <div className="text-center p-8 pb-6">
                <h1 className="text-4xl font-display text-forest-green tracking-wide font-bold mb-2">
                  Estre
                </h1>
                <p className="text-forest-green/70 font-body text-lg">
                  Luxury Furniture Crafted for Your Perfect Home
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="px-8 pb-6">
                <div className="bg-gold-500/10 rounded-xl p-1 flex border border-gold-500/20">
                  <button
                    onClick={() => setMode('signin')}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                      ${mode === 'signin'
                        ? 'bg-forest-green text-ivory-white shadow-luxury'
                        : 'text-forest-green hover:bg-gold-500/20'
                      }
                    `}
                  >
                    <span className="font-medium">Sign In</span>
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                      ${mode === 'signup'
                        ? 'bg-forest-green text-ivory-white shadow-luxury'
                        : 'text-forest-green hover:bg-gold-500/20'
                      }
                    `}
                  >
                    <span className="font-medium">Sign Up</span>
                  </button>
                </div>
              </div>

              {/* User Type Toggle (for signup) */}
              {mode === 'signup' && (
                <div className="px-8 pb-6">
                  <div className="bg-gold-500/10 rounded-xl p-1 flex border border-gold-500/20">
                    <button
                      onClick={() => setUserType('customer')}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                        ${userType === 'customer'
                          ? 'bg-gold-500 text-ivory-white shadow-luxury'
                          : 'text-forest-green hover:bg-gold-500/20'
                        }
                      `}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Customer</span>
                    </button>
                    <button
                      onClick={() => setUserType('staff')}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                        ${userType === 'staff'
                          ? 'bg-gold-500 text-ivory-white shadow-luxury'
                          : 'text-forest-green hover:bg-gold-500/20'
                        }
                      `}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Staff</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{errors.submit}</span>
                    </div>
                  )}

                  {/* Full Name Field (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-forest-green font-body text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`
                          w-full bg-ivory-white border rounded-lg px-4 py-3 text-forest-green placeholder-forest-green/60 font-body h-12 shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200
                          ${errors.fullName ? 'border-red-400' : 'border-gold-500/30 hover:border-gold-500/50'}
                        `}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-forest-green font-body text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`
                          w-full bg-ivory-white border rounded-lg pl-10 pr-4 py-3 text-forest-green placeholder-forest-green/60 font-body h-12 shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200
                          ${errors.email ? 'border-red-400' : 'border-gold-500/30 hover:border-gold-500/50'}
                        `}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field (signup customer only) */}
                  {mode === 'signup' && userType === 'customer' && (
                    <div>
                      <label className="block text-forest-green text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`
                            w-full bg-ivory-white border rounded-lg pl-10 pr-4 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                            ${errors.phone ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                          `}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label className="block text-forest-green text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`
                          w-full bg-ivory-white border rounded-lg pl-10 pr-12 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                          ${errors.password ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                        `}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green/60 hover:text-gold-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-forest-green text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`
                            w-full bg-ivory-white border rounded-lg pl-10 pr-12 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                            ${errors.confirmPassword ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                          `}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green/60 hover:text-gold-500 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-gold-500 bg-ivory-white border-gold-500/30 rounded focus:ring-gold-500 focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-forest-green text-sm">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-forest-gradient text-ivory-white font-body font-semibold py-4 px-6 rounded-xl hover:shadow-luxury transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-12"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-ivory-white/30 border-t-ivory-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {userType === 'customer' ? <User className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                        <span>
                          {mode === 'signin' 
                            ? (userType === 'customer' ? 'Sign In' : 'Access Dashboard')
                            : 'Create Account'
                          }
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-forest-green/60 font-body text-xs">
                    By continuing, you agree to our terms of service and privacy policy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Split Layout */}
          <div className="hidden lg:flex bg-ivory-white/95 backdrop-blur-md rounded-2xl border border-gold-500/30 shadow-luxury-lg overflow-hidden min-h-[600px]">
            {/* Left Side - Brand & Features */}
            <div className="flex-1 p-12 flex flex-col justify-center bg-forest-gradient">
              <div className="max-w-lg">
                <h1 className="text-6xl font-display text-ivory-white tracking-wide font-bold mb-6">
                  Estre
                </h1>
                <p className="text-ivory-white/80 font-body text-xl mb-8 leading-relaxed">
                  Luxury Furniture Crafted for Your Perfect Home
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <UserCheck className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                      <h3 className="text-ivory-white font-body font-semibold mb-1">Premium Quality</h3>
                      <p className="text-ivory-white/70 font-body text-sm leading-relaxed">Handcrafted with finest materials and expert attention to detail</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <Settings className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                      <h3 className="text-ivory-white font-body font-semibold mb-1">Custom Design</h3>
                      <p className="text-ivory-white/70 font-body text-sm leading-relaxed">Tailored configurations to match your exact preferences</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <Users className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                      <h3 className="text-ivory-white font-body font-semibold mb-1">Expert Support</h3>
                      <p className="text-ivory-white/70 font-body text-sm leading-relaxed">Dedicated customer service and professional installation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 p-12 flex flex-col justify-center">
              <div className="max-w-md w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display text-forest-green mb-2 font-bold">
                    {mode === 'signin' ? 'Welcome Back' : 'Join Estre'}
                  </h2>
                  <p className="text-forest-green/70 font-body">
                    {mode === 'signin' 
                      ? 'Sign in to continue your luxury furniture journey'
                      : 'Create your account to start configuring luxury furniture'
                    }
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="mb-8">
                  <div className="bg-gold-500/10 rounded-xl p-1 flex border border-gold-500/20">
                    <button
                      onClick={() => setMode('signin')}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                        ${mode === 'signin'
                          ? 'bg-forest-green text-ivory-white shadow-luxury'
                          : 'text-forest-green hover:bg-gold-500/20'
                        }
                      `}
                    >
                      <span className="font-medium">Sign In</span>
                    </button>
                    <button
                      onClick={() => setMode('signup')}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                        ${mode === 'signup'
                          ? 'bg-forest-green text-ivory-white shadow-luxury'
                          : 'text-forest-green hover:bg-gold-500/20'
                        }
                      `}
                    >
                      <span className="font-medium">Sign Up</span>
                    </button>
                  </div>
                </div>

                {/* User Type Toggle (for signup) */}
                {mode === 'signup' && (
                  <div className="mb-8">
                    <div className="bg-gold-500/10 rounded-xl p-1 flex border border-gold-500/20">
                      <button
                        onClick={() => setUserType('customer')}
                        className={`
                          flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                          ${userType === 'customer'
                            ? 'bg-gold-500 text-ivory-white shadow-luxury'
                            : 'text-forest-green hover:bg-gold-500/20'
                          }
                        `}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">Customer</span>
                      </button>
                      <button
                        onClick={() => setUserType('staff')}
                        className={`
                          flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                          ${userType === 'staff'
                            ? 'bg-gold-500 text-ivory-white shadow-luxury'
                            : 'text-forest-green hover:bg-gold-500/20'
                          }
                        `}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="font-medium">Staff</span>
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{errors.submit}</span>
                    </div>
                  )}

                  {/* Full Name Field (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-forest-green text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`
                          w-full bg-ivory-white border rounded-lg px-4 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                          ${errors.fullName ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                        `}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-forest-green text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`
                          w-full bg-ivory-white border rounded-lg pl-10 pr-4 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                          ${errors.email ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                        `}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field (signup customer only) */}
                  {mode === 'signup' && userType === 'customer' && (
                    <div>
                      <label className="block text-forest-green text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`
                            w-full bg-ivory-white border rounded-lg pl-10 pr-4 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                            ${errors.phone ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                          `}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label className="block text-forest-green text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`
                          w-full bg-ivory-white border rounded-lg pl-10 pr-12 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                          ${errors.password ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                        `}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green/60 hover:text-gold-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-forest-green text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-green/60" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`
                            w-full bg-ivory-white border rounded-lg pl-10 pr-12 py-3 text-forest-green placeholder-forest-green/60 shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-200
                            ${errors.confirmPassword ? 'border-red-400' : 'border-gold-500/30 focus:border-gold-500'}
                          `}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green/60 hover:text-gold-500 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-desktop"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-gold-500 bg-ivory-white border-gold-500/30 rounded focus:ring-gold-500 focus:ring-2"
                    />
                    <label htmlFor="remember-desktop" className="text-forest-green text-sm">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-forest-gradient text-ivory-white font-body font-semibold py-4 px-6 rounded-xl hover:shadow-luxury transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-ivory-white/30 border-t-ivory-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {userType === 'customer' ? <User className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                        <span>
                          {mode === 'signin' 
                            ? (userType === 'customer' ? 'Sign In' : 'Access Dashboard')
                            : 'Create Account'
                          }
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-forest-green/60 text-xs">
                    By continuing, you agree to our terms of service and privacy policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};