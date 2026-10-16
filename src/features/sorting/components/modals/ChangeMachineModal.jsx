import React, { useState } from 'react';
import { X, SlidersHorizontal, Wrench, Search, CheckCircle2, Cpu, Filter } from 'lucide-react';
import { AVAILABLE_MACHINES, MACHINE_TYPES } from '../../data/machines';

export default function ChangeMachineModal({
  isOpen,
  onClose,
  currentMachineId = 'RW-G01',
  onSelectMachine,
}) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'rework' | 'sorting'
  const [searchKeyword, setSearchKeyword] = useState('');

  if (!isOpen) return null;

  const reworkMachines = AVAILABLE_MACHINES.filter(
    (m) => m.type === MACHINE_TYPES.REWORK
  );
  const sortingMachines = AVAILABLE_MACHINES.filter(
    (m) => m.type === MACHINE_TYPES.SORTING
  );

  const filterMatches = (m) => {
    if (activeFilter !== 'ALL' && m.type !== activeFilter) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.workshop.toLowerCase().includes(q)
      );
    }
    return true;
  };

  const displayedRework = reworkMachines.filter(filterMatches);
  const displayedSorting = sortingMachines.filter(filterMatches);

  const renderMachineCard = (m) => {
    const isSelected = currentMachineId === m.id;
    const isRework = m.type === MACHINE_TYPES.REWORK;

    return (
      <div
        key={m.id}
        onClick={() => {
          onSelectMachine(m);
          onClose();
        }}
        className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
          isSelected
            ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${
                isRework
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              }`}
            >
              {isRework ? <Wrench size={14} /> : <Filter size={14} />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{m.id}</span>
                {isSelected && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white">
                    <CheckCircle2 size={10} /> Hiện tại
                  </span>
                )}
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                    isRework
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {m.typeName}
                </span>
              </div>
              <div className="text-xs text-slate-700 font-medium mt-0.5">{m.name}</div>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
              m.status === 'Sẵn sàng'
                ? 'bg-emerald-100 text-emerald-800'
                : m.status === 'Đang chạy'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {m.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
          <span>Vị trí: <strong className="text-slate-700">{m.workshop}</strong></span>
          <span>Lệnh: <strong className="text-slate-700">{m.activeOrderCode}</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div
        className="mes-modal-box max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="mes-modal-header border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="mes-modal-title text-base font-bold text-slate-900">
                Đổi máy & Chuyển giao diện trạm
              </h3>
              <p className="text-xs text-slate-500">
                Chọn máy Rework hoặc Sorting để tự động chuyển sang giao diện chuyên biệt
              </p>
            </div>
          </div>
          <button type="button" className="mes-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Search & Type Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({AVAILABLE_MACHINES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter(MACHINE_TYPES.REWORK)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeFilter === MACHINE_TYPES.REWORK
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wrench size={13} />
              Máy Rework ({reworkMachines.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter(MACHINE_TYPES.SORTING)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeFilter === MACHINE_TYPES.SORTING
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Filter size={13} />
              Máy Sorting ({sortingMachines.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm mã máy, vị trí..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Body: 2 distinct groups */}
        <div className="mes-modal-body p-4 space-y-5 overflow-y-auto flex-1">
          {/* Nhóm 1: MÁY REWORK */}
          {(activeFilter === 'ALL' || activeFilter === MACHINE_TYPES.REWORK) && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Nhóm Máy Rework
                  </h4>
                  <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.2 rounded-full font-medium">
                    Giao diện Rework chuyên biệt
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {displayedRework.length} máy khả dụng
                </span>
              </div>

              {displayedRework.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg">
                  Không tìm thấy máy Rework phù hợp
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {displayedRework.map(renderMachineCard)}
                </div>
              )}
            </div>
          )}

          {/* Nhóm 2: MÁY SORTING */}
          {(activeFilter === 'ALL' || activeFilter === MACHINE_TYPES.SORTING) && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Nhóm Máy Sorting (Phân loại)
                  </h4>
                  <span className="text-[11px] text-indigo-700 bg-indigo-100 px-2 py-0.2 rounded-full font-medium">
                    Giao diện Sorting chuyên biệt
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {displayedSorting.length} máy khả dụng
                </span>
              </div>

              {displayedSorting.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg">
                  Không tìm thấy máy Sorting phù hợp
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {displayedSorting.map(renderMachineCard)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mes-modal-footer border-t border-slate-200 px-4 py-2.5 flex items-center justify-between bg-slate-50">
          <div className="text-[11px] text-slate-500">
            * Chọn máy để hệ thống tự động tải cấu hình và giao diện tương ứng
          </div>
          <button type="button" className="mes-btn-cancel px-4 py-1.5" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
