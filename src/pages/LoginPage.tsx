import React, { useState } from 'react';
import { ArrowRight, User, Users, Eye, EyeOff, Phone, Mail, Lock, UserCheck, Settings } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string; phone?: string; id: string; type: 'customer' | 'staff' }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState<'customer' | 'staff'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (for customers)
    if (userType === 'customer') {
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      id: userType === 'customer' ? `EST${Date.now().toString().slice(-6)}` : `STF${Date.now().toString().slice(-6)}`,
      type: userType,
    };
    
    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem('estre-remember', JSON.stringify({
        email: formData.email,
        userType,
      }));
    }
    
    onLogin(userData);
    setIsLoading(false);
  };

  const handleGuestContinue = () => {
    const guestData = {
      name: 'Guest User',
      email: 'guest@estre.com',
      id: `GST${Date.now().toString().slice(-6)}`,
      type: 'customer' as const,
    };
    onLogin(guestData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-desert-sand bg-parchment relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-champagne-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-burnt-sienna/10 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Mobile/Tablet: Single Card Layout */}
          <div className="lg:hidden">
            <div className="bg-desert-sand/95 backdrop-blur-md rounded-2xl border border-champagne-gold/30 shadow-luxury-lg overflow-hidden shadow-parchment">
              {/* Header */}
              <div className="text-center p-8 pb-6">
                <h1 className="text-4xl font-display text-burnt-sienna tracking-wide font-bold mb-2">
                  Estre
                </h1>
                <p className="text-warm-grey-600 font-body text-lg">
                  Luxury Furniture Crafted for Your Perfect Home
                </p>
              </div>

              {/* User Type Toggle */}
              <div className="px-8 pb-6">
                <div className="bg-champagne-gold/10 rounded-xl p-1 flex border border-champagne-gold/20">
                  <button
                    onClick={() => setUserType('customer')}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                      ${userType === 'customer'
                        ? 'bg-burnt-sienna text-desert-sand shadow-desert-shadow'
                        : 'text-rich-brown-800 hover:bg-champagne-gold/20'
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
                        ? 'bg-burnt-sienna text-desert-sand shadow-desert-shadow'
                        : 'text-rich-brown-800 hover:bg-champagne-gold/20'
                      }
                    `}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Staff</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-rich-brown-800 font-body text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`
                        w-full bg-desert-sand border rounded-lg px-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 font-body h-12 shadow-parchment
                        focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold transition-all duration-200
                        ${errors.name ? 'border-red-400' : 'border-champagne-gold/30 hover:border-champagne-gold/50'}
                      `}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-rich-brown-800 font-body text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`
                          w-full bg-desert-sand border rounded-lg pl-10 pr-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 font-body h-12 shadow-parchment
                          focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold transition-all duration-200
                          ${errors.email ? 'border-red-400' : 'border-champagne-gold/30 hover:border-champagne-gold/50'}
                        `}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field (Customer Only) */}
                  {userType === 'customer' && (
                    <div>
                      <label className="block text-rich-brown-800 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`
                            w-full bg-desert-sand border rounded-lg pl-10 pr-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 shadow-parchment
                            focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 transition-all duration-200
                            ${errors.phone ? 'border-red-400' : 'border-champagne-gold/30 focus:border-champagne-gold'}
                          `}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label className="block text-rich-brown-800 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`
                          w-full bg-desert-sand border rounded-lg pl-10 pr-12 py-3 text-rich-brown-800 placeholder-warm-grey-500 shadow-parchment
                          focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 transition-all duration-200
                          ${errors.password ? 'border-red-400' : 'border-champagne-gold/30 focus:border-champagne-gold'}
                        `}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warm-grey-500 hover:text-champagne-gold transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-champagne-gold bg-desert-sand border-champagne-gold/30 rounded focus:ring-champagne-gold focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-rich-brown-800 text-sm">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-burnt-gradient text-desert-sand font-body font-semibold py-4 px-6 rounded-xl hover:shadow-desert-shadow transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-12"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-desert-sand/30 border-t-desert-sand rounded-full animate-spin" />
                    ) : (
                      <>
                        {userType === 'customer' ? <User className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                        <span>
                          {userType === 'customer' ? 'Continue to Shop' : 'Access Dashboard'}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Additional Options */}
                {userType === 'customer' && (
                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-champagne-gold/30"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-desert-sand text-warm-grey-600">or</span>
                      </div>
                    </div>

                    <button
                      onClick={handleGuestContinue}
                      className="w-full bg-desert-sand text-rich-brown-800 font-body font-medium py-3 px-6 rounded-xl border border-champagne-gold/30 hover:bg-champagne-gold/10 hover:border-champagne-gold transition-all duration-200 flex items-center justify-center space-x-2 h-12 shadow-parchment"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Continue as Guest</span>
                    </button>

                    <div className="text-center">
                      <button className="text-champagne-gold hover:text-champagne-gold/80 font-body text-sm font-medium transition-colors">
                        Register as New Customer →
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-warm-grey-600 font-body text-xs">
                    By continuing, you agree to our terms of service and privacy policy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Split Layout */}
          <div className="hidden lg:flex bg-desert-sand/95 backdrop-blur-md rounded-2xl border border-champagne-gold/30 shadow-luxury-lg overflow-hidden min-h-[600px] shadow-parchment">
            {/* Left Side - Brand & Features */}
            <div className="flex-1 p-12 flex flex-col justify-center">
              <div className="max-w-lg">
                <h1 className="text-6xl font-display text-burnt-sienna tracking-wide font-bold mb-6">
                  Estre
                </h1>
                <p className="text-warm-grey-600 font-body text-xl mb-8 leading-relaxed">
                  Luxury Furniture Crafted for Your Perfect Home
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-champagne-gold/20 rounded-xl flex items-center justify-center border border-champagne-gold/30">
                      <UserCheck className="w-6 h-6 text-burnt-sienna" />
                    </div>
                    <div>
                      <h3 className="text-rich-brown-800 font-body font-semibold mb-1">Premium Quality</h3>
                      <p className="text-warm-grey-600 font-body text-sm leading-relaxed">Handcrafted with finest materials and expert attention to detail</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-champagne-gold/20 rounded-xl flex items-center justify-center border border-champagne-gold/30">
                      <Settings className="w-6 h-6 text-burnt-sienna" />
                    </div>
                    <div>
                      <h3 className="text-rich-brown-800 font-body font-semibold mb-1">Custom Design</h3>
                      <p className="text-warm-grey-600 font-body text-sm leading-relaxed">Tailored configurations to match your exact preferences</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-champagne-gold/20 rounded-xl flex items-center justify-center border border-champagne-gold/30">
                      <Users className="w-6 h-6 text-burnt-sienna" />
                    </div>
                    <div>
                      <h3 className="text-rich-brown-800 font-body font-semibold mb-1">Expert Support</h3>
                      <p className="text-warm-grey-600 font-body text-sm leading-relaxed">Dedicated customer service and professional installation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 p-12 flex flex-col justify-center">
              <div className="max-w-md w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display text-rich-brown-800 mb-2 font-bold">
                    Welcome Back
                  </h2>
                  <p className="text-warm-grey-600 font-body">
                    Sign in to continue your luxury furniture journey
                  </p>
                </div>

                {/* User Type Toggle */}
                <div className="mb-8">
                  <div className="bg-champagne-gold/10 rounded-xl p-1 flex border border-champagne-gold/20">
                    <button
                      onClick={() => setUserType('customer')}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 font-body font-medium
                        ${userType === 'customer'
                          ? 'bg-burnt-sienna text-desert-sand shadow-desert-shadow'
                          : 'text-rich-brown-800 hover:bg-champagne-gold/20'
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
                          ? 'bg-burnt-sienna text-desert-sand shadow-desert-shadow'
                          : 'text-rich-brown-800 hover:bg-champagne-gold/20'
                        }
                      `}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Staff</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-rich-brown-800 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`
                        w-full bg-desert-sand border rounded-lg px-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 shadow-parchment
                        focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 transition-all duration-200
                        ${errors.name ? 'border-red-400' : 'border-champagne-gold/30 focus:border-champagne-gold'}
                      `}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-rich-brown-800 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`
                          w-full bg-desert-sand border rounded-lg pl-10 pr-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 shadow-parchment
                          focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 transition-all duration-200
                          ${errors.email ? 'border-red-400' : 'border-champagne-gold/30 focus:border-champagne-gold'}
                        `}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field (Customer Only) */}
                  {userType === 'customer' && (
                    <div>
                      <label className="block text-rich-brown-800 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`
                            w-full bg-desert-sand border rounded-lg pl-10 pr-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 shadow-parchment
                            focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 transition-all duration-200
                            ${errors.phone ? 'border-red-400' : 'border-champagne-gold/30 focus:border-champagne-gold'}
                          `}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label className="block text-rich-brown-800 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`
                          w-full bg-desert-sand border rounded-lg pl-10 pr-12 py-3 text-rich-brown-800 placeholder-warm-grey-500 shadow-parchment
                          focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 transition-all duration-200
                          ${errors.password ? 'border-red-400' : 'border-champagne-gold/30 focus:border-champagne-gold'}
                        `}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warm-grey-500 hover:text-champagne-gold transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-desktop"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-champagne-gold bg-desert-sand border-champagne-gold/30 rounded focus:ring-champagne-gold focus:ring-2"
                    />
                    <label htmlFor="remember-desktop" className="text-rich-brown-800 text-sm">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-burnt-gradient text-desert-sand font-body font-semibold py-4 px-6 rounded-xl hover:shadow-desert-shadow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-desert-sand/30 border-t-desert-sand rounded-full animate-spin" />
                    ) : (
                      <>
                        {userType === 'customer' ? <User className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                        <span>
                          {userType === 'customer' ? 'Continue to Shop' : 'Access Dashboard'}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Additional Options */}
                {userType === 'customer' && (
                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-champagne-gold/30"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-desert-sand text-warm-grey-600">or</span>
                      </div>
                    </div>

                    <button
                      onClick={handleGuestContinue}
                      className="w-full bg-desert-sand text-rich-brown-800 font-body font-medium py-3 px-6 rounded-xl border border-champagne-gold/30 hover:bg-champagne-gold/10 hover:border-champagne-gold transition-all duration-200 flex items-center justify-center space-x-2 shadow-parchment"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Continue as Guest</span>
                    </button>

                    <div className="text-center">
                      <button className="text-champagne-gold hover:text-champagne-gold/80 text-sm font-medium transition-colors">
                        Register as New Customer →
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-warm-grey-600 text-xs">
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