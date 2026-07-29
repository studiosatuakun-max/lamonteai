'use client';

import React, { useState } from 'react';
import { Candidate } from '@/types/recruitment';
import {
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  RotateCw,
} from 'lucide-react';

interface CVDocumentViewerProps {
  candidate: Candidate;
}

export default function CVDocumentViewer({ candidate }: CVDocumentViewerProps) {
  const [zoom, setZoom] = useState(100);

  const fileName = `CV_${candidate.name.replace(/\s+/g, '_')}.pdf`;

  const initials = candidate.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-100">
      {/* Viewer toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-700 border-b border-slate-600 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-slate-300" />
          <span className="text-xs font-500 text-slate-200 font-tabular">
            Document Viewer — {fileName}
          </span>
          <span className="rounded bg-slate-600 px-1.5 py-0.5 text-[10px] text-slate-300 font-500">
            PDF
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(60, z - 10))}
            className="flex h-7 w-7 items-center justify-center rounded text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-150"
            title="Zoom out"
          >
            <ZoomOut size={13} />
          </button>
          <span className="px-2 text-xs text-slate-300 font-tabular w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="flex h-7 w-7 items-center justify-center rounded text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-150"
            title="Zoom in"
          >
            <ZoomIn size={13} />
          </button>
          <div className="h-4 w-px bg-slate-600 mx-1" />
          <button
            onClick={() => setZoom(100)}
            className="flex h-7 w-7 items-center justify-center rounded text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-150"
            title="Reset zoom"
          >
            <RotateCw size={13} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-150"
            title="Fullscreen"
          >
            <Maximize2 size={13} />
          </button>
          <button
            className="flex items-center gap-1.5 h-7 px-2.5 rounded bg-primary text-primary-foreground text-xs font-500 hover:bg-blue-700 transition-all duration-150 ml-1"
            title="Download CV"
          >
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      {/* Document area */}
      <div className="flex-1 overflow-auto panel-scroll bg-slate-200 p-6 flex justify-center">
        <div
          className="bg-white shadow-elevated transition-all duration-200 origin-top"
          style={{
            width: `${(595 * zoom) / 100}px`,
            minHeight: `${(842 * zoom) / 100}px`,
            transform: `scale(1)`,
            fontSize: `${zoom}%`,
          }}
        >
          {/* CV Content */}
          <div className="p-10 text-[13px] leading-relaxed text-slate-800 font-sans">
            {/* CV Header */}
            <div className="border-b-2 border-primary pb-5 mb-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-700 text-slate-900 tracking-tight">
                    {candidate.name}
                  </h1>
                  <p className="text-base text-primary font-500 mt-0.5">{candidate.role}</p>
                  <div className="mt-2 flex flex-col gap-0.5 text-xs text-slate-500">
                    <span>✉ {candidate.email}</span>
                    <span>✆ {candidate.phone}</span>
                    <span>⌂ {candidate.location}</span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-xl border-2 border-primary/20">
                  {initials}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <section className="mb-5">
              <h2 className="text-xs font-700 uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-primary/20" />
                Professional Summary
                <span className="h-px flex-1 bg-primary/20" />
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {candidate.scoreCategory === 'High'
                  ? `Accomplished ${candidate.role} with ${candidate.experience} of industry experience in retail and mass-market fashion. Proven track record of delivering commercially successful collections across multiple product categories. Strong proficiency in Adobe Creative Suite and deep understanding of Indonesian consumer fashion trends. Collaborative team player with experience mentoring junior designers.`
                  : candidate.scoreCategory === 'Medium'
                  ? `Fashion designer with ${candidate.experience} of professional experience across various fashion categories. Skilled in Adobe Illustrator and design development. Passionate about translating trend research into commercially viable designs. Looking to grow within a dynamic retail fashion environment.`
                  : `Motivated fashion designer with ${candidate.experience} of foundational experience. Eager to develop skills in retail fashion design and contribute to a growing creative team. Strong academic background in fashion design with exposure to industry-standard tools.`}
              </p>
            </section>

            {/* Work Experience */}
            <section className="mb-5">
              <h2 className="text-xs font-700 uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-primary/20" />
                Work Experience
                <span className="h-px flex-1 bg-primary/20" />
              </h2>

              {candidate.id === 1 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-600 text-slate-900">Senior Designer — Womenswear</p>
                        <p className="text-xs text-primary font-500">PT Matahari Department Store · Jakarta</p>
                      </div>
                      <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">Mar 2022 – Present</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-inside">
                      <li>Led seasonal collection design for 3 mass-market womenswear lines (200+ SKUs/season)</li>
                      <li>Managed a team of 4 junior designers through full design-to-production cycle</li>
                      <li>Reduced sample revision rounds by 30% through improved technical specification process</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-600 text-slate-900">Fashion Designer</p>
                        <p className="text-xs text-primary font-500">PT MAP Aktif Adiperkasa · Jakarta</p>
                      </div>
                      <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">Jun 2019 – Feb 2022</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-inside">
                      <li>Designed retail-ready collections for 2 private label brands</li>
                      <li>Collaborated with merchandising on trend analysis and range planning</li>
                    </ul>
                  </div>
                </div>
              )}

              {candidate.id === 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-600 text-slate-900">Fashion Designer</p>
                        <p className="text-xs text-primary font-500">Studio Rara Boutique · Bandung</p>
                      </div>
                      <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">Jan 2025 – Present</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-inside">
                      <li>Design bespoke womenswear collections for boutique clientele</li>
                      <li>Manage end-to-end design process from concept to final garment</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-600 text-slate-900">Junior Designer</p>
                        <p className="text-xs text-primary font-500">Batik Keris · Solo</p>
                      </div>
                      <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">Mar 2024 – Dec 2024</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-inside">
                      <li>Assisted senior designers in pattern development and sampling</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-600 text-slate-900">Design Intern</p>
                        <p className="text-xs text-primary font-500">Erigo Store · Jakarta</p>
                      </div>
                      <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">Aug 2023 – Feb 2024</span>
                    </div>
                  </div>
                </div>
              )}

              {candidate.id !== 1 && candidate.id !== 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-600 text-slate-900">{candidate.role}</p>
                        <p className="text-xs text-primary font-500">
                          {candidate.id % 3 === 0 ? 'PT Sritex · Solo' : candidate.id % 3 === 1 ? 'Zara Indonesia · Jakarta' : 'H&M Indonesia · Jakarta'}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">
                        {candidate.id % 2 === 0 ? 'Jan 2022 – Present' : 'Mar 2021 – Present'}
                      </span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-inside">
                      <li>Delivered seasonal collections across womenswear and menswear categories</li>
                      <li>Collaborated with cross-functional teams on trend research and range planning</li>
                      <li>Managed design documentation and technical specification packages</li>
                    </ul>
                  </div>
                  {candidate.experience !== '1 year' && (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-600 text-slate-900">Junior Fashion Designer</p>
                          <p className="text-xs text-primary font-500">
                            {candidate.id % 2 === 0 ? 'Cotton Ink · Jakarta' : 'Uniqlo Indonesia · Jakarta'}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 font-tabular whitespace-nowrap">
                          {candidate.id % 2 === 0 ? 'Jun 2019 – Dec 2021' : 'Feb 2020 – Feb 2021'}
                        </span>
                      </div>
                      <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-inside">
                        <li>Supported senior designers in collection development and sampling process</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Education */}
            <section className="mb-5">
              <h2 className="text-xs font-700 uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-primary/20" />
                Education
                <span className="h-px flex-1 bg-primary/20" />
              </h2>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-600 text-slate-900">
                    {candidate.education.split(',')[0]}
                  </p>
                  <p className="text-xs text-slate-500">
                    {candidate.education.split(',').slice(1).join(',')}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-tabular">
                  {candidate.id % 2 === 0 ? '2017 – 2021' : '2016 – 2020'}
                </span>
              </div>
            </section>

            {/* Skills */}
            <section className="mb-5">
              <h2 className="text-xs font-700 uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-primary/20" />
                Skills & Tools
                <span className="h-px flex-1 bg-primary/20" />
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {[
                  'Adobe Illustrator',
                  'Adobe Photoshop',
                  'Adobe InDesign',
                  'Trend Forecasting',
                  'Technical Drawing',
                  'Pattern Making',
                  candidate.matchPoints.some((m) => m.toLowerCase().includes('clo3d'))
                    ? 'Clo3D (Advanced)' :'Clo3D (Beginner)',
                  'Microsoft Office',
                ].map((skill, si) => (
                  <div key={`skill-${candidate.id}-${si}`} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                    {skill}
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xs font-700 uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-primary/20" />
                Languages
                <span className="h-px flex-1 bg-primary/20" />
              </h2>
              <div className="flex gap-4 text-xs text-slate-600">
                <span>Bahasa Indonesia — Native</span>
                <span className="text-slate-300">·</span>
                <span>English — Professional Working Proficiency</span>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-300 font-tabular">
              {fileName} · Generated by LamonteAI Recruitment Platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}