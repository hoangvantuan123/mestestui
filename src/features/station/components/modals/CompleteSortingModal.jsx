import React, { useState } from 'react';
import { X, CheckCircle2, PackageCheck, AlertTriangle, Printer, Layers } from 'lucide-react';

export default function CompleteSortingModal({ isOpen, onClose, order, onConfirm }) {
  const [goodWarehouse, setGoodWarehouse] = useState('KTP-01: Kho Thành Phẩm Đạt Chuẩn - Nhà máy 1');
  const [defectWarehouse, setDefectWarehouse] = useState('KNG-02: Kho Hàng Lỗi / Chờ Rework PX1B');
  const [isPrintLabel, setIsPrintLabel] = useState(true);
  const [sealTray, setSealTray] = useState(true);
  const [inspectorNotes, setInspectorNotes] = useState('Đã kiểm tra ngoại quan 100%, dán tem QC Pass');

  if (!isOpen || !order) return null;

  const targetQty = Number(order.targetQty) || 0;
  const goodQty = Number(order.goodQty) || 0;
  const defectQty = Number(order.defectQty) || 0;
  const sortedQty = Number(order.sortedQty) || (goodQty + defectQty);
  const passRate = sortedQty > 0 ? ((goodQty / sortedQty) * 100).toFixed(2) : '100.00';

  const handleFinish = (e) => {
    e.preventDefault();
    onConfirm({
      goodWarehouse,
      defectWarehouse,
      isPrintLabel,
      sealTray,
      inspectorNotes,
      finalGood: goodQty,
      finalDefect: defectQty,
      finalPassRate: passRate,
    });
    onClose();
  };

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div
        className="mes-modal-box max-w-xl w-full"
        style={{ width: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mes-modal-header bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck size={20} className="text-emerald-400" />
            <div>
              <h3 className="mes-modal-title text-white font-bold text-sm">
                Nghiệm thu & Hoàn thành Lô Sorting: {order.stepOrder}
              </h3>
              <p className="text-[11px] text-slate-300">
                Lot: <span className="text-emerald-300 font-bold">{order.lotNo}</span> • Sản phẩm: {order.productCode}
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

        <form onSubmit={handleFinish}>
          <div className="mes-modal-body p-4 space-y-4 text-xs">
            {/* KPI Summary Banner */}
            <div className="grid grid-cols-4 gap-2 bg-gradient-to-r from-slate-900 to-blue-950 p-3 rounded-lg text-white text-center shadow">
              <div>
                <span className="text-[10px] text-slate-300 block">KẾ HOẠCH</span>
                <span className="text-sm font-bold font-mono">{targetQty.toLocaleString('vi-VN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-300 block">ĐÃ SORT</span>
                <span className="text-sm font-bold font-mono text-blue-200">{sortedQty.toLocaleString('vi-VN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block">ĐẠT (OK)</span>
                <span className="text-sm font-bold font-mono text-emerald-300">{goodQty.toLocaleString('vi-VN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-300 block">LỖI (NG)</span>
                <span className="text-sm font-bold font-mono text-rose-300">{defectQty.toLocaleString('vi-VN')}</span>
              </div>
            </div>

            {/* Pass Rate Callout */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-950">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="font-semibold text-xs">
                  Tỷ lệ đạt chuẩn chất lượng lô (Yield Rate):
                </span>
              </div>
              <span className="text-base font-extrabold text-emerald-700 font-mono">
                {passRate}%
              </span>
            </div>

            {/* Warehouse destination select */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kho nhập hàng ĐẠT (OK Products Warehouse):
                </label>
                <select
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium text-xs bg-white focus:ring-1 focus:ring-blue-500"
                  value={goodWarehouse}
                  onChange={(e) => setGoodWarehouse(e.target.value)}
                >
                  <option value="KTP-01: Kho Thành Phẩm Đạt Chuẩn - Nhà máy 1">
                    KTP-01: Kho Thành Phẩm Đạt Chuẩn - Nhà máy 1
                  </option>
                  <option value="KTP-02: Kho Đóng Thùng Xuất Khẩu">
                    KTP-02: Kho Đóng Thùng Xuất Khẩu
                  </option>
                  <option value="KTP-L1: Kho Trung Gian Line Lắp Ráp">
                    KTP-L1: Kho Trung Gian Line Lắp Ráp
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kho chuyển hàng LỖI (NG / Chờ Rework Warehouse):
                </label>
                <select
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium text-xs bg-white focus:ring-1 focus:ring-blue-500"
                  value={defectWarehouse}
                  onChange={(e) => setDefectWarehouse(e.target.value)}
                >
                  <option value="KNG-02: Kho Hàng Lỗi / Chờ Rework PX1B">
                    KNG-02: Kho Hàng Lỗi / Chờ Rework PX1B
                  </option>
                  <option value="KNG-03: Kho Phế Liệu Chờ Tiêu Hủy">
                    KNG-03: Kho Phế Liệu Chờ Tiêu Hủy
                  </option>
                  <option value="KRMA-01: Kho Trả Lại Nhà Cung Cấp">
                    KRMA-01: Kho Trả Lại Nhà Cung Cấp
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ghi chú kết luận nghiệm thu:
                </label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isPrintLabel}
                  onChange={(e) => setIsPrintLabel(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <Printer size={14} className="text-slate-600" />
                <span>Tự động in tem thùng QC Pass và tem phân loại hàng đạt/lỗi</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={sealTray}
                  onChange={(e) => setSealTray(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <Layers size={14} className="text-slate-600" />
                <span>Đóng seal niêm phong khay ({order.currentTray || 'Khay hiện tại'})</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="mes-modal-footer bg-slate-50 flex items-center justify-between p-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Xác nhận nghiệm thu lệnh và đóng phiên làm việc.
            </span>
            <div className="flex gap-2">
              <button type="button" className="mes-btn-cancel text-xs px-4 py-1.5" onClick={onClose}>
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Xác nhận hoàn thành lô
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
