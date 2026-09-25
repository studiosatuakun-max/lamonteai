'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Eye, Users, Clock, Filter, SlidersHorizontal, UploadCloud, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CANDIDATES, VACANCY_TITLE, VACANCY_DEPARTMENT, VACANCY_LOCATION, VACANCY_POSTED } from '@/data/candidates';
import { Candidate, CandidateStatus, ScoreCategory } from '@/types/recruitment';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreBadge from '@/components/ui/ScoreBadge';
import CandidateStatsBar from './CandidateStatsBar';

type SortField = 'score' | 'appliedDate' | 'name' | 'status';
type SortDir = 'asc' | 'desc';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
const STATUS_FILTERS: (CandidateStatus | 'All')[] = ['All', 'Pending', 'Shortlisted', 'Hold', 'Rejected'];
const SCORE_FILTERS: (ScoreCategory | 'All')[] = ['All', 'High', 'Medium', 'Low'];

export default function CandidateListContent() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'All'>('All');
  const [scoreFilter, setScoreFilter] = useState<ScoreCategory | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [candidatesList, setCandidatesList] = useState(CANDIDATES);
  const [isUploading, setIsUploading] = useState(false);

  // CRUD Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    role: 'Sofa Specialist Designer',
    email: '',
    phone: '',
    location: 'Jakarta, Indonesia',
    experience: '3 years',
    status: 'Pending' as CandidateStatus,
    score: 85,
    channel: 'JobStreet',
  });

  // Backend integration point: replace with API call to PATCH /api/applications/:id/status
  const [candidateStatuses, setCandidateStatuses] = useState<Record<number, CandidateStatus>>(
    Object.fromEntries(CANDIDATES.map((c) => [c.id, c.status]))
  );

  const handleOpenCreateModal = () => {
    setCandidateForm({
      name: '',
      role: 'Sofa Specialist Designer',
      email: '',
      phone: '',
      location: 'Jakarta, Indonesia',
      experience: '2 years',
      status: 'Pending',
      score: 85,
      channel: 'Manual Upload',
    });
    setIsCreateOpen(true);
  };

  const handleOpenEditModal = (c: Candidate) => {
    setSelectedCandidate(c);
    setCandidateForm({
      name: c.name,
      role: c.role,
      email: c.email,
      phone: c.phone,
      location: c.location,
      experience: c.experience,
      status: candidateStatuses[c.id] || c.status,
      score: c.score,
      channel: c.channel || 'Manual',
    });
    setIsEditOpen(true);
  };

  const handleOpenDeleteModal = (c: Candidate) => {
    setSelectedCandidate(c);
    setIsDeleteOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name) return;
    const newId = candidatesList.length > 0 ? Math.max(...candidatesList.map(c => c.id)) + 1 : 1;
    const cat: ScoreCategory = candidateForm.score >= 80 ? 'High' : candidateForm.score >= 60 ? 'Medium' : 'Low';
    
    const created: Candidate = {
      id: newId,
      name: candidateForm.name,
      role: candidateForm.role,
      email: candidateForm.email || 'kandidat@example.com',
      phone: candidateForm.phone || '+62 812-0000-0000',
      location: candidateForm.location,
      experience: candidateForm.experience,
      education: "Bachelor's Degree",
      appliedDate: new Date().toISOString().split('T')[0],
      channel: candidateForm.channel,
      score: Number(candidateForm.score) || 80,
      scoreCategory: cat,
      status: candidateForm.status,
      matchPoints: ['Keahlian Desain', 'Pengalaman Relevan'],
      gapPoints: [],
      flags: [],
    };

    setCandidatesList([created, ...candidatesList]);
    setCandidateStatuses(prev => ({ ...prev, [created.id]: created.status }));
    setIsCreateOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    const cat: ScoreCategory = candidateForm.score >= 80 ? 'High' : candidateForm.score >= 60 ? 'Medium' : 'Low';

    const nextList = candidatesList.map(c => {
      if (c.id !== selectedCandidate.id) return c;
      return {
        ...c,
        name: candidateForm.name,
        role: candidateForm.role,
        email: candidateForm.email,
        phone: candidateForm.phone,
        location: candidateForm.location,
        experience: candidateForm.experience,
        status: candidateForm.status,
        score: Number(candidateForm.score) || c.score,
        scoreCategory: cat,
        channel: candidateForm.channel,
      };
    });

    setCandidatesList(nextList);
    setCandidateStatuses(prev => ({ ...prev, [selectedCandidate.id]: candidateForm.status }));
    setIsEditOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!selectedCandidate) return;
    setCandidatesList(candidatesList.filter(c => c.id !== selectedCandidate.id));
    setIsDeleteOpen(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const simulateCVUpload = () => {
    setIsUploading(true);
    
    setTimeout(() => {
      const newCandidate = {
        id: candidatesList.length + 1,
        name: "Rizky Ramadhan",
        email: "rizky.ramadhan@example.com",
        phone: "+62 812 3456 7890",
        location: "Jakarta, Indonesia",
        experience: "3 years",
        education: "Bachelor's Degree",
        role: "Data Analyst",
        appliedDate: new Date().toISOString().split('T')[0],
        channel: "Email",
        score: 92,
        scoreCategory: "High" as ScoreCategory,
        status: "Pending" as CandidateStatus,
        matchPoints: ["Next.js", "React", "Tailwind CSS"],
        gapPoints: ["GraphQL"],
        flags: [],
      };
      setCandidatesList((prev) => [newCandidate, ...prev]);
      setCandidateStatuses((prev) => ({ ...prev, [newCandidate.id]: "Pending" }));
      setIsUploading(false);
    }, 3000);
  };

  const filtered = useMemo(() => {
    let result = candidatesList.map((c) => ({
      ...c,
      status: candidateStatuses[c.id] ?? c.status,
    }));

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.experience.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (scoreFilter !== 'All') {
      result = result.filter((c) => c.scoreCategory === scoreFilter);
    }

    result.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sortField === 'score') { av = a.score; bv = b.score; }
      else if (sortField === 'appliedDate') { av = a.appliedDate; bv = b.appliedDate; }
      else if (sortField === 'name') { av = a.name; bv = b.name; }
      else if (sortField === 'status') { av = a.status; bv = b.status; }

      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, statusFilter, scoreFilter, sortField, sortDir, candidateStatuses, candidatesList]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allStatuses = useMemo(
    () => candidatesList.map((c) => candidateStatuses[c.id] ?? c.status),
    [candidateStatuses, candidatesList]
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={13} className="text-muted-foreground ml-1" />;
    return sortDir === 'asc'
      ? <ArrowUp size={13} className="text-primary ml-1" />
      : <ArrowDown size={13} className="text-primary ml-1" />;
  };

  const handleQuickStatus = (e: React.MouseEvent, candidateId: number, status: CandidateStatus) => {
    e.stopPropagation();
    setCandidateStatuses((prev) => ({ ...prev, [candidateId]: status }));
  };

  return (
    <div className="px-6 py-6 max-w-screen-2xl mx-auto space-y-5">
      {/* Vacancy context card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 mb-4 flex items-start gap-3">
        <AlertTriangle className="text-indigo-600 shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-sm font-semibold text-indigo-900">AI Smart Alert: Kurang Pelamar dari JobStreet</h4>
          <p className="text-xs text-indigo-700 mt-1">Sistem mendeteksi bahwa posisi ini sepi pelamar dari JobStreet dalam 3 hari terakhir. AI menyarankan untuk melakukan <i>bump</i> postingan atau mencoba saluran Glints.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-700 text-foreground">{VACANCY_TITLE}</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-600 text-primary">
              Active
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{VACANCY_DEPARTMENT}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{VACANCY_LOCATION}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Posted {VACANCY_POSTED}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
            <Users size={14} />
            <span className="font-600 text-foreground">{candidatesList.length}</span>
            <span>total applicants</span>
          </div>
          <button 
            onClick={handleOpenCreateModal} 
            className="flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 text-sm font-500 text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Plus size={15} />
            <span>+ Tambah Kandidat</span>
          </button>
          <button 
            onClick={simulateCVUpload} 
            disabled={isUploading} 
            className="flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-500 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses OCR...</span>
              </>
            ) : (
              <>
                <UploadCloud size={16} />
                <span>Unggah CV Baru</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <CandidateStatsBar statuses={allStatuses} totalCandidates={candidatesList.length} />

      {/* Filters + Search */}
      <div className="bg-card border border-border rounded-xl shadow-card px-5 py-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, location..."
              className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <SlidersHorizontal size={13} />
              Filters:
            </span>

            {/* Status filter chips */}
            {STATUS_FILTERS.map((s) => (
              <button
                key={`status-chip-${s}`}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-500 border transition-all duration-150 ${
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                }`}
              >
                {s}
              </button>
            ))}

            <span className="h-4 w-px bg-border mx-1" />

            {/* Score filter chips */}
            {SCORE_FILTERS.map((s) => (
              <button
                key={`score-chip-${s}`}
                onClick={() => { setScoreFilter(s); setCurrentPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-500 border transition-all duration-150 ${
                  scoreFilter === s
                    ? 'bg-foreground text-primary-foreground border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                }`}
              >
                {s === 'All' ? 'All Scores' : `${s} Match`}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary */}
        {(statusFilter !== 'All' || scoreFilter !== 'All' || search) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
            <Filter size={12} />
            <span>
              Showing {filtered.length} of {candidatesList.length} candidates
            </span>
            <button
              onClick={() => { setSearch(''); setStatusFilter('All'); setScoreFilter('All'); setCurrentPage(1); }}
              className="text-primary hover:underline font-500"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground w-8">
                  #
                </th>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center text-xs font-600 uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    Candidate <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('appliedDate')}
                    className="flex items-center text-xs font-600 uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    Applied <SortIcon field="appliedDate" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 min-w-[140px]">
                  <button
                    onClick={() => handleSort('score')}
                    className="flex items-center text-xs font-600 uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    AI Score <SortIcon field="score" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                  Matches
                </th>
                <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                  Channel
                </th>
                <th className="text-left px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                  Flags
                </th>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center text-xs font-600 uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users size={36} className="text-muted-foreground/40" />
                      <p className="text-sm font-500 text-foreground">No candidates found</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        No applicants match your current filters. Try adjusting the status or score filter above.
                      </p>
                      <button
                        onClick={() => { setSearch(''); setStatusFilter('All'); setScoreFilter('All'); }}
                        className="btn-primary mt-1"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((candidate, idx) => {
                  const rowNum = (currentPage - 1) * itemsPerPage + idx + 1;
                  const hasFlags = candidate.flags.length > 0;
                  return (
                    <tr
                      key={`candidate-row-${candidate.id}`}
                      onClick={() =>
                        router.push(`/candidate-review?id=${candidate.id}`)
                      }
                      className={`border-b border-border last:border-0 cursor-pointer transition-colors duration-100 hover:bg-accent/60 ${
                        idx % 2 === 0 ? '' : 'bg-muted/20'
                      }`}
                    >
                      {/* # */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground font-tabular">
                        {rowNum}
                      </td>

                      {/* Candidate */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-xs flex-shrink-0">
                            {candidate.name
                              .split(' ')
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="font-600 text-foreground text-sm truncate">
                              {candidate.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {candidate.location} · {candidate.experience}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground font-tabular whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(candidate.appliedDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* AI Score */}
                      <td className="px-4 py-3.5">
                        <ScoreBadge score={candidate.score} category={candidate.scoreCategory} />
                      </td>

                      {/* Matches */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                          <span className="text-sm font-600 text-green-700 font-tabular">
                            {candidate.matchPoints.length}
                          </span>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-slate-600 px-2 py-1 rounded bg-slate-100">
                          {candidate.channel || ['JobStreet', 'Email', 'Glints', 'Manual'][candidate.id % 4]}
                        </span>
                      </td>

                      {/* Flags */}
                      <td className="px-4 py-3.5">
                        {hasFlags ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                            <span className="text-sm font-600 text-amber-600 font-tabular">
                              {candidate.flags.length}
                            </span>
                            <span className="text-xs text-muted-foreground">flag{candidate.flags.length > 1 ? 's' : ''}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={candidate.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {candidate.status === 'Pending' && (
                            <>
                              <button
                                onClick={(e) => handleQuickStatus(e, candidate.id, 'Shortlisted')}
                                title="Quick Shortlist"
                                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-green-50 hover:text-green-600 transition-all duration-150"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                              <button
                                onClick={(e) => handleQuickStatus(e, candidate.id, 'Rejected')}
                                title="Quick Reject"
                                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => router.push(`/candidate-review?id=${candidate.id}`)}
                            title="Review candidate"
                            className="flex h-7 items-center gap-1 px-2 rounded-md text-xs font-500 text-primary bg-primary/5 hover:bg-primary/15 transition-all duration-150"
                          >
                            <Eye size={13} />
                            Review
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(candidate)}
                            title="Edit kandidat"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-slate-100 hover:text-slate-800 transition-all duration-150"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(candidate)}
                            title="Hapus kandidat"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="h-7 rounded border border-border bg-background px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={`per-page-${n}`} value={n}>{n}</option>
                ))}
              </select>
              <span>per page · {filtered.length} total</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-7 w-7 items-center justify-center rounded border text-xs font-500 transition-all duration-150 ${
                    currentPage === page
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:text-primary hover:border-primary'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CANDIDATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Plus size={18} />
                    Tambah Data Kandidat Baru
                  </h3>
                  <p className="text-emerald-100 text-xs mt-0.5">Daftarkan pelamar baru ke pipeline rekrutmen.</p>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="text-emerald-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="e.g. Andhika Pratama"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Posisi / Role</label>
                    <input
                      type="text"
                      value={candidateForm.role}
                      onChange={(e) => setCandidateForm({ ...candidateForm, role: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Channel Pendaftaran</label>
                    <select
                      value={candidateForm.channel}
                      onChange={(e) => setCandidateForm({ ...candidateForm, channel: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="JobStreet">JobStreet</option>
                      <option value="Glints">Glints</option>
                      <option value="Email">Email</option>
                      <option value="Manual Upload">Manual Upload</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={candidateForm.email}
                      onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      placeholder="andhika@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">No. HP / WhatsApp</label>
                    <input
                      type="text"
                      value={candidateForm.phone}
                      onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lokasi</label>
                    <input
                      type="text"
                      value={candidateForm.location}
                      onChange={(e) => setCandidateForm({ ...candidateForm, location: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pengalaman</label>
                    <input
                      type="text"
                      value={candidateForm.experience}
                      onChange={(e) => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AI Score (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={candidateForm.score}
                      onChange={(e) => setCandidateForm({ ...candidateForm, score: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-3 py-1.5 rounded-lg border text-slate-700 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs"
                  >
                    Simpan Kandidat
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CANDIDATE MODAL */}
      <AnimatePresence>
        {isEditOpen && selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit Profil Kandidat
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">{selectedCandidate.name}</p>
                </div>
                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Posisi / Role</label>
                    <input
                      type="text"
                      value={candidateForm.role}
                      onChange={(e) => setCandidateForm({ ...candidateForm, role: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status Rekrutmen</label>
                    <select
                      value={candidateForm.status}
                      onChange={(e) => setCandidateForm({ ...candidateForm, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Hold">Hold</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={candidateForm.email}
                      onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">No. HP / WhatsApp</label>
                    <input
                      type="text"
                      value={candidateForm.phone}
                      onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lokasi</label>
                    <input
                      type="text"
                      value={candidateForm.location}
                      onChange={(e) => setCandidateForm({ ...candidateForm, location: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AI Score (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={candidateForm.score}
                      onChange={(e) => setCandidateForm({ ...candidateForm, score: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-3 py-1.5 rounded-lg border text-slate-700 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-medium text-xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CANDIDATE MODAL */}
      <AnimatePresence>
        {isDeleteOpen && selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Data Kandidat?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Hapus kandidat <strong className="text-slate-800">{selectedCandidate.name}</strong> ({selectedCandidate.role}) dari pipeline rekrutmen?
              </p>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 py-2 rounded-lg border text-slate-700 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}