'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { User, Bell, Shield, Palette, Mail, Camera, Save, Check, Globe } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'Profile', icon: <User size={16} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { key: 'security', label: 'Security', icon: <Shield size={16} /> },
  { key: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout
      breadcrumbs={[{ label: 'Settings' }]}
      vacancyTitle="Settings"
    >
      <div className="px-6 py-6 max-w-screen-2xl mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden flex min-h-[500px]">
          {/* Settings sidebar */}
          <div className="w-52 flex-shrink-0 border-r border-border p-3 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-500 transition-all w-full text-left ${
                  activeTab === tab.key
                    ? 'bg-accent text-primary font-600'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Settings content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-700 text-foreground mb-1">Profile Information</h2>
                <p className="text-sm text-muted-foreground mb-6">Update your personal details and profile picture</p>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-xl">AP</div>
                  <div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-500 hover:border-primary hover:text-primary transition-all">
                      <Camera size={14} />
                      Change photo
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-4 max-w-lg">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-600 text-foreground">First Name</label>
                    <input className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" defaultValue="Andi" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-600 text-foreground">Last Name</label>
                    <input className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" defaultValue="Pratama" />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-600 text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" defaultValue="andi.pratama@lamonte.id" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-600 text-foreground">Job Title</label>
                    <input className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" defaultValue="HR Manager" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-600 text-foreground">Department</label>
                    <input className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" defaultValue="Human Resources" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-600 text-foreground">Location</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" defaultValue="Jakarta, Indonesia" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 max-w-lg">
                  <button className="btn-primary" onClick={handleSave}>
                    {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-700 text-foreground mb-1">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground mb-6">Choose how and when you want to be notified</p>
                <div className="space-y-0 max-w-lg">
                  {[
                    { label: 'New candidate applications', desc: 'Get notified when someone applies', on: true },
                    { label: 'AI scoring completed', desc: 'Alert when AI finishes scoring', on: true },
                    { label: 'Interview reminders', desc: 'Reminded about upcoming interviews', on: true },
                    { label: 'Weekly digest', desc: 'Weekly summary of recruitment activity', on: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-600 text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <label className="settings-toggle">
                        <input type="checkbox" defaultChecked={item.on} />
                        <span className="settings-toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-700 text-foreground mb-1">Security Settings</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your password and authentication</p>
                <div className="grid grid-cols-2 gap-4 max-w-lg">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-600 text-foreground">Current Password</label>
                    <input type="password" className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" placeholder="Enter current password" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-600 text-foreground">New Password</label>
                    <input type="password" className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" placeholder="New password" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-600 text-foreground">Confirm Password</label>
                    <input type="password" className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all" placeholder="Confirm password" />
                  </div>
                </div>
                <div className="mt-6 max-w-lg">
                  <button className="btn-primary" onClick={handleSave}>
                    {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Update Password</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-700 text-foreground mb-1">Appearance</h2>
                <p className="text-sm text-muted-foreground mb-6">Customize the look and feel</p>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button
                      key={theme}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        theme === 'Light' ? 'border-primary bg-accent' : 'border-border hover:border-primary'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg border border-border overflow-hidden ${
                        theme === 'Light' ? 'bg-slate-50' : theme === 'Dark' ? 'bg-slate-900' : 'bg-gradient-to-r from-slate-50 to-slate-900'
                      }`}>
                        <div className={`h-3 ${theme === 'Dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                      </div>
                      <span className="text-xs font-500">{theme}</span>
                      {theme === 'Light' && (
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check size={10} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
