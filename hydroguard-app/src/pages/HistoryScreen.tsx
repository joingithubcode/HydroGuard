import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdSearch, MdFilterList, MdClose,
  MdCheckCircle, MdWarning, MdError, MdHistory,
} from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { Card, QualityBadge, Input, Select, Button } from '../components/ui';
import { formatDateTime } from '../utils';
import type { QualityGrade, LiquidType } from '../types';

const qualityColors: Record<QualityGrade, string> = {
  Excellent: 'text-emerald-500',
  Good: 'text-blue-500',
  Fair: 'text-amber-500',
  Poor: 'text-red-500',
};

const qualityIcons: Record<QualityGrade, React.ReactNode> = {
  Excellent: <MdCheckCircle size={22} />,
  Good: <MdCheckCircle size={22} />,
  Fair: <MdWarning size={22} />,
  Poor: <MdError size={22} />,
};

const liquidEmojis: Record<string, string> = {
  Water: '💧', Juice: '🍊', Milk: '🥛', Tea: '🍵', Coffee: '☕', Other: '🧪',
};

const ITEMS_PER_PAGE = 5;

export default function HistoryScreen() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [liquidFilter, setLiquidFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return state.recentResults.filter(r => {
      const matchesSearch =
        !search ||
        r.liquidType.toLowerCase().includes(search.toLowerCase()) ||
        r.quality.toLowerCase().includes(search.toLowerCase());
      const matchesQuality = !qualityFilter || r.quality === qualityFilter;
      const matchesLiquid = !liquidFilter || r.liquidType === liquidFilter;
      return matchesSearch && matchesQuality && matchesLiquid;
    });
  }, [state.recentResults, search, qualityFilter, liquidFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch('');
    setQualityFilter('');
    setLiquidFilter('');
    setPage(1);
  };

  const hasFilters = search || qualityFilter || liquidFilter;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Test History</h1>
          <p className="text-slate-400 text-sm mt-1">{state.recentResults.length} total tests</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
            showFilters ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MdFilterList size={18} />
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-red-400" />}
        </button>
      </div>

      {/* Search */}
      <Input
        icon={<MdSearch size={20} />}
        placeholder="Search by liquid type or quality..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />

      {/* Filters */}
      {showFilters && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700 text-sm">Filter Results</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 flex items-center gap-1">
                <MdClose size={14} /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Quality Grade"
              value={qualityFilter}
              onChange={e => { setQualityFilter(e.target.value); setPage(1); }}
              options={[
                { value: '', label: 'All Grades' },
                { value: 'Excellent', label: '🟢 Excellent' },
                { value: 'Good', label: '🔵 Good' },
                { value: 'Fair', label: '🟡 Fair' },
                { value: 'Poor', label: '🔴 Poor' },
              ]}
            />
            <Select
              label="Liquid Type"
              value={liquidFilter}
              onChange={e => { setLiquidFilter(e.target.value); setPage(1); }}
              options={[
                { value: '', label: 'All Types' },
                ...(['Water', 'Juice', 'Milk', 'Tea', 'Coffee', 'Other'] as LiquidType[]).map(t => ({
                  value: t,
                  label: `${liquidEmojis[t]} ${t}`,
                })),
              ]}
            />
          </div>
        </Card>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Total', value: filtered.length, color: 'text-slate-700' },
          { label: 'Excellent', value: filtered.filter(r => r.quality === 'Excellent').length, color: 'text-emerald-600' },
          { label: 'Good', value: filtered.filter(r => r.quality === 'Good').length, color: 'text-blue-600' },
          { label: 'Poor', value: filtered.filter(r => r.quality === 'Poor').length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="glass-card p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Results List */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <MdHistory size={60} className="text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">No tests found</p>
          <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          {hasFilters && (
            <Button variant="secondary" size="sm" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map(result => (
            <div
              key={result.id}
              className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              onClick={() => navigate('/results', { state: { result } })}
            >
              <div className={`text-2xl ${qualityColors[result.quality]}`}>
                {qualityIcons[result.quality]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-base">{liquidEmojis[result.liquidType]}</span>
                  <span className="font-semibold text-slate-700 text-sm">{result.liquidType}</span>
                  <QualityBadge quality={result.quality} />
                </div>
                <p className="text-xs text-slate-400">{formatDateTime(result.createdAt)}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  pH: <span className="font-medium">{result.sensorData.ph.toFixed(1)}</span>
                  {' · '}
                  TDS: <span className="font-medium">{result.sensorData.tds.toFixed(0)} ppm</span>
                  {' · '}
                  {result.expiryDays > 0
                    ? <span className="text-emerald-600 font-medium">{result.expiryDays}d remaining</span>
                    : <span className="text-red-500 font-medium">Expired</span>
                  }
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base font-bold text-primary-600">{result.confidence}%</p>
                <p className="text-xs text-slate-400">confidence</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
