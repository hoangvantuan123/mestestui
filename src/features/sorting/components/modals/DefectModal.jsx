import React, { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

export default function DefectModal({ isOpen, onClose, order, onConfirm }) {
  const [goodQty, setGoodQty] = useState(order?.producedQty || 347);
  const [defectQty, setDefectQty] = useState(0);
  const [defectType, setDefectType] = useState('Trầy xước bề mặt');
  const [defectNote, setDefectNote] = useState('');

  if (!isOpen || !order) return null;

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div className="mes-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="mes-modal-header">
          <div className="flex items-center gap-2">
            <RotateCcw size={20} className="text-blue-600" />
            <h3 className="mes-modal-title">Ghi nhận hoàn tất lỗi / Phân loại</h3>
          </div>
          <button type="button" className="mes-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mes-modal-body text-xs space-y-3">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div><strong>Lệnh:</strong> {order.stepOrder} ({order.category || order.operation})</div>
            <div><strong>Tổng SL Rework:</strong> {order.reworkQty}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-emerald-700">SL Đạt (OK):</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-emerald-700"
                value={goodQty}
                onChange={(e) => setGoodQty(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-red-600">SL Lỗi (NG):</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-red-600"
                value={defectQty}
                onChange={(e) => setDefectQty(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Loại lỗi chính:</label>
            <select
              className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              value={defectType}
              onChange={(e) => setDefectType(e.target.value)}
            >
              <option value="Trầy xước bề mặt">Trầy xước bề mặt</option>
              <option value="Bụi bẩn bám dính">Bụi bẩn bám dính</option>
              <option value="Lệch kích thước / Cong vênh">Lệch kích thước / Cong vênh</option>
              <option value="Lỗi bao bì thùng">Lỗi bao bì thùng</option>
              <option value="Lỗi in tem / Mã vạch">Lỗi in tem / Mã vạch</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Ghi chú khắc phục:</label>
            <textarea
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 h-16"
              placeholder="Nhập nội dung xử lý..."
              value={defectNote}
              onChange={(e) => setDefectNote(e.target.value)}
            />
          </div>
        </div>

        <div className="mes-modal-footer">
          <button type="button" className="mes-btn-cancel" onClick={onClose}>
            Đóng
          </button>
          <button
            type="button"
            className="mes-btn-confirm-blue"
            onClick={() => {
              onConfirm && onConfirm({ orderId: order.id, goodQty, defectQty, defectType, defectNote });
              onClose();
            }}
          >
            <Check size={16} className="mr-1" />
            Lưu kết quả phân loại
          </button>
        </div>
      </div>
    </div>
  );
}
