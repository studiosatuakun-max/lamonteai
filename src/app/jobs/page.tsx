import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Briefcase, MapPin, Clock, Users } from 'lucide-react';

const DUMMY_JOBS = [
  { id: 1, title: 'Senior Fashion Designer', dept: 'Creative & Design', location: 'Jakarta, Indonesia', applicants: 8, posted: '15 Jul 2026', status: 'Active' },
  { id: 2, title: 'UX Researcher', dept: 'Product', location: 'Remote', applicants: 12, posted: '10 Jul 2026', status: 'Active' },
  { id: 3, title: 'Product Manager', dept: 'Product', location: 'Jakarta, Indonesia', applicants: 21, posted: '05 Jul 2026', status: 'Active' },
  { id: 4, title: 'Data Analyst', dept: 'Engineering', location: 'Bandung, Indonesia', applicants: 6, posted: '01 Jul 2026', status: 'Paused' },
  { id: 5, title: 'Frontend Developer', dept: 'Engineering', location: 'Remote', applicants: 15, posted: '28 Jun 2026', status: 'Closed' },
];

export default function JobsPage() {
  return (
    <AppLayout
      breadcrumbs={[{ label: 'Job Vacancies' }]}
      vacancyTitle="Job Vacancies"
    >
      <div className="px-6 py-6 max-w-screen-2xl mx-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl shadow-card px-5 py-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Briefcase size={18} /></span>
            <div>
              <p className="text-2xl font-700 text-foreground">{DUMMY_JOBS.length}</p>
              <p className="text-xs text-muted-foreground">Total Vacancies</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-card px-5 py-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600"><Users size={18} /></span>
            <div>
              <p className="text-2xl font-700 text-foreground">{DUMMY_JOBS.reduce((s, j) => s + j.applicants, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Applicants</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-card px-5 py-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock size={18} /></span>
            <div>
              <p className="text-2xl font-700 text-foreground">{DUMMY_JOBS.filter(j => j.status === 'Active').length}</p>
              <p className="text-xs text-muted-foreground">Active Positions</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground w-8">#</th>
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">Position</th>
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">Applicants</th>
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">Posted</th>
                  <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_JOBS.map((job, idx) => (
                  <tr key={job.id} className={`border-b border-border last:border-0 hover:bg-accent/60 transition-colors ${idx % 2 !== 0 ? 'bg-muted/20' : ''}`}>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground font-tabular">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-primary flex-shrink-0" />
                        <span className="font-600 text-foreground">{job.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{job.dept}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-sm">
                        <Users size={13} className="text-muted-foreground" />
                        <span className="font-600 font-tabular">{job.applicants}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        {job.posted}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-600 ${
                        job.status === 'Active' ? 'bg-green-50 text-green-700' :
                        job.status === 'Paused' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
