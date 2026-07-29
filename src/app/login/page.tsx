'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Dummy login — simulate loading then redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Grid pattern overlay */}
      <div className="login-grid-overlay" />

      <div className="login-container">
        {/* Left side — branding */}
        <div className="login-branding">
          <div className="login-brand-content">
            <div className="login-logo-wrapper">
              <div className="login-logo-icon">
                <Sparkles size={28} />
              </div>
              <h1 className="login-brand-name">LamonteAI</h1>
            </div>
            <p className="login-brand-tagline">
              AI-Powered Recruitment Intelligence
            </p>
            <div className="login-brand-features">
              {[
                'Smart candidate scoring & ranking',
                'Match-gap analysis in seconds',
                'Structured hiring decisions',
              ].map((feat, i) => (
                <div key={i} className="login-feature-item" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
                  <div className="login-feature-dot" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — login form */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-card-header">
              <h2 className="login-card-title">Welcome back</h2>
              <p className="login-card-subtitle">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="login-input"
                  autoComplete="email"
                />
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="login-password" className="login-label">
                    Password
                  </label>
                  <button type="button" className="login-forgot-link">
                    Forgot password?
                  </button>
                </div>
                <div className="login-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="login-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-remember-row">
                <label className="login-checkbox-label">
                  <input type="checkbox" className="login-checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>


            <p className="login-footer-text">
              Don&apos;t have an account?{' '}
              <button type="button" className="login-signup-link">
                Request access
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
