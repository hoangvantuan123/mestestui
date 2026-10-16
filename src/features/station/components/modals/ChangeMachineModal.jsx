import React, { useState } from 'react';
import { X, SlidersHorizontal, Wrench, SearchCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const MACHINE_LIST = [
  // 1. Máy Rework
  {
    id: 'RWK-G01',
    name: 'Trạm Rework Sửa chữa G01',
    type: 'rework',
    typeName: 'Rework',
    stage: 'CDRE',
    line: 'Line G01 - PX1B',
    status: 'Sẵn sàng',
    orderInRun: 'CDRE-0626-0008',
  },

  // 2. Máy Sorting
  {
    id: 'SORT-G01',
    name: 'Trạm Sorting Phân loại Ngoại quan G01',
    type: 'sorting',
    typeName: 'Sorting',
    stage: 'CDST',
    line: 'Line ST01 - PX QC',
    status: 'Sẵn sàng',
    orderInRun: 'CDST-0626-0012',
  },
];

export default function ChangeMachineModal({
  isOpen,
  onClose,
  currentMachine = 'RWK-G01',
  onSelectMachine,
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'rework' | 'sorting'
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMachines = MACHINE_LIST.filter((m) => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.line.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div
        className="mes-modal-box max-w-xl w-full"
        style={{ width: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mes-modal-header bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-blue-400" />
            <h3 className="mes-modal-title text-white font-bold text-base">
              Chuyển đổi Máy / Trạm sản xuất
            </h3>
          </div>
          <button
            type="button"
            className="mes-modal-close text-slate-300 hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row gap-2 justify-between items-center text-xs">
          {/* Station type buttons */}
          <div className="flex rounded-md p-1 bg-slate-200 border border-slate-300 w-full sm:w-auto">
            <button
              type="button"
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                filterType === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setFilterType('all')}
            >
              Tất cả trạm ({MACHINE_LIST.length})
            </button>
            <button
              type="button"
              className={`px-3 py-1 font-semibold rounded flex items-center gap-1.5 transition-colors ${
                filterType === 'rework'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setFilterType('rework')}
            >
              <Wrench size={13} /> Trạm Rework ({MACHINE_LIST.filter((m) => m.type === 'rework').length})
            </button>
            <button
              type="button"
              className={`px-3 py-1 font-semibold rounded flex items-center gap-1.5 transition-colors ${
                filterType === 'sorting'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setFilterType('sorting')}
            >
              <SearchCheck size={13} /> Trạm Sorting ({MACHINE_LIST.filter((m) => m.type === 'sorting').length})
            </button>
          </div>

          {/* Quick search input */}
          <input
            type="text"
            placeholder="Tìm theo mã máy, tên trạm, line..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-56 px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Machine list body */}
        <div className="mes-modal-body p-4 space-y-2.5 max-h-[380px] overflow-y-auto">
          {filteredMachines.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Không tìm thấy máy nào khớp với từ khóa tìm kiếm.
            </div>
          ) : (
            filteredMachines.map((m) => {
              const isCurrent = currentMachine === m.id;
              const isRework = m.type === 'rework';

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (onSelectMachine) {
                      onSelectMachine(m);
                    }
                    onClose();
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-400 shadow-sm'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Machine Type Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isRework
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                      title={isRework ? 'Trạm Rework (Sửa chữa)' : 'Trạm Sorting (Phân loại)'}
                    >
                      {isRework ? <Wrench size={18} /> : <SearchCheck size={18} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{m.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isRework ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {m.typeName.toUpperCase()}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1">
                            <CheckCircle2 size={11} /> Đang chọn
                          </span>
                        )}
                      </div>
                      <div className="text-slate-700 text-xs font-medium mt-0.5">{m.name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {m.line} • Công đoạn: <span className="font-semibold text-slate-600">{m.stage}</span> • Lệnh: {m.orderInRun}
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        m.status === 'Sẵn sàng'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : m.status === 'Đang chạy'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          m.status === 'Sẵn sàng'
                            ? 'bg-emerald-500'
                            : m.status === 'Đang chạy'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-rose-500'
                        }`}
                      />
                      {m.status}
                    </span>
                    <div className="text-[11px] text-blue-600 font-medium hover:underline mt-1">
                      {isCurrent ? 'Trạm hiện tại' : 'Chuyển sang máy này →'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mes-modal-footer bg-slate-50 flex items-center justify-between p-3 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Hệ thống sẽ tự động chuyển sang giao diện tương ứng (Rework hoặc Sorting).</span>
          </div>
          <button type="button" className="mes-btn-cancel text-xs px-4 py-1.5" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
