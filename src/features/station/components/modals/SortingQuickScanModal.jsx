import React, { useState } from 'react';
import { X, Barcode, CheckCircle2, AlertTriangle, Plus, Sparkles, Layers } from 'lucide-react';

export default function SortingQuickScanModal({ isOpen, onClose, order, onConfirm }) {
  const [scanInput, setScanInput] = useState('');
  const [goodIncrement, setGoodIncrement] = useState(50);
  const [defectCounts, setDefectCounts] = useState({
    dust: 0,
    scratch: 0,
    dent: 0,
    bubble: 0,
    other: 0,
  });
  const [currentTray, setCurrentTray] = useState(order?.currentTray || 'TRAY-07/15');
  const [note, setNote] = useState('');

  if (!isOpen || !order) return null;

  const totalDefectIncrement =
    (defectCounts.dust || 0) +
    (defectCounts.scratch || 0) +
    (defectCounts.dent || 0) +
    (defectCounts.bubble || 0) +
    (defectCounts.other || 0);

  const handleIncrementDefect = (field, amount = 1) => {
    setDefectCounts((prev) => ({
      ...prev,
      [field]: Math.max(0, (prev[field] || 0) + amount),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      goodIncrement: Number(goodIncrement) || 0,
      totalDefectIncrement,
      defectCounts,
      currentTray,
      note,
    });
    onClose();
  };

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div
        className="mes-modal-box max-w-2xl w-full"
        style={{ width: '700px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mes-modal-header bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Barcode size={20} className="text-blue-400" />
            <div>
              <h3 className="mes-modal-title text-white font-bold text-sm">
                Quét mã & Phân loại Sorting: {order.stepOrder}
              </h3>
              <p className="text-[11px] text-slate-300">
                Lot: <span className="text-blue-300 font-bold">{order.lotNo}</span> • Sản phẩm: {order.productCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mes-modal-close text-slate-300 hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mes-modal-body p-4 space-y-4 text-xs">
            {/* Quick Barcode Scanner input */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
              <label className="block text-xs font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                <Barcode size={15} className="text-blue-600" />
                Quét Barcode Serial / Khay / Thùng linh kiện (Máy quét cầm tay):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 text-xs font-mono border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Quét hoặc nhập mã Barcode..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                  onClick={() => {
                    if (scanInput) {
                      setGoodIncrement((prev) => prev + 1);
                      setScanInput('');
                    }
                  }}
                >
                  Ghi nhận (1 Đạt)
                </button>
              </div>
            </div>

            {/* Current Summary Progress */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">KẾ HOẠCH LÔ</span>
                <span className="font-bold text-sm text-slate-800">
                  {Number(order.targetQty).toLocaleString('vi-VN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ĐÃ SORT HIỆN TẠI</span>
                <span className="font-bold text-sm text-blue-700">
                  {Number(order.sortedQty).toLocaleString('vi-VN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ĐẠT (OK) HIỆN TẠI</span>
                <span className="font-bold text-sm text-emerald-700">
                  {Number(order.goodQty).toLocaleString('vi-VN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">LỖI (NG) HIỆN TẠI</span>
                <span className="font-bold text-sm text-rose-700">
                  {Number(order.defectQty).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Input Batch for Good Qty */}
            <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Số lượng Hàng Đạt (OK) thêm vào lô:
                </span>
                <div className="flex gap-1">
                  {[10, 25, 50, 100].map((step) => (
                    <button
                      key={step}
                      type="button"
                      className="px-2 py-0.5 bg-white border border-emerald-300 rounded text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                      onClick={() => setGoodIncrement((prev) => (Number(prev) || 0) + step)}
                    >
                      +{step}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-1.5 text-base font-bold font-mono text-emerald-800 border border-emerald-300 rounded bg-white"
                value={goodIncrement}
                onChange={(e) => setGoodIncrement(e.target.value)}
              />
            </div>

            {/* Defect Classification Matrix (NG) */}
            <div className="border border-rose-200 bg-rose-50/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                  <AlertTriangle size={15} className="text-rose-600" />
                  Phân loại Lỗi Ngoại quan (NG) phát hiện thêm: (Tổng: {totalDefectIncrement} Pcs)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* 1. Dust */}
                <div className="bg-white p-2 rounded border border-rose-200 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">Bụi / Dị vật</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-slate-100 border text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('dust', -1)}
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-rose-700">{defectCounts.dust}</span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('dust', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 2. Scratch */}
                <div className="bg-white p-2 rounded border border-rose-200 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">Xước bề mặt</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-slate-100 border text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('scratch', -1)}
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-rose-700">{defectCounts.scratch}</span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('scratch', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 3. Dent */}
                <div className="bg-white p-2 rounded border border-rose-200 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">Móp / Cấn góc</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-slate-100 border text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('dent', -1)}
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-rose-700">{defectCounts.dent}</span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('dent', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 4. Bubble */}
                <div className="bg-white p-2 rounded border border-rose-200 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">Bọt khí kính</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-slate-100 border text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('bubble', -1)}
                    >
                      -
                    </button>
                    <span className="font-bold font-mono text-rose-700">{defectCounts.bubble}</span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center justify-center"
                      onClick={() => handleIncrementDefect('bubble', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Khay / Thùng hiện tại */}
            <div className="flex items-center gap-3">
              <div className="w-1/2">
                <label className="block text-slate-600 font-semibold mb-1 flex items-center gap-1">
                  <Layers size={13} /> Khay / Thùng chứa (Tray ID):
                </label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs"
                  value={currentTray}
                  onChange={(e) => setCurrentTray(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-slate-600 font-semibold mb-1">Ghi chú kiểm tra:</label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                  placeholder="Ghi chú thêm nếu có..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mes-modal-footer bg-slate-50 flex items-center justify-between p-3 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Ghi nhận: <strong className="text-emerald-700">+{goodIncrement} Đạt</strong> |{' '}
              <strong className="text-rose-700">+{totalDefectIncrement} Lỗi</strong>
            </span>
            <div className="flex gap-2">
              <button type="button" className="mes-btn-cancel text-xs px-4 py-1.5" onClick={onClose}>
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Lưu kết quả
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
