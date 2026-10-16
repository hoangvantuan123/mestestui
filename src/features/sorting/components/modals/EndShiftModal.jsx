import React from 'react';
import { X, Power } from 'lucide-react';

export default function EndShiftModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="mes-modal-backdrop" onClick={onClose}>
      <div className="mes-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="mes-modal-header">
          <div className="flex items-center gap-2 text-red-600">
            <Power size={20} />
            <h3 className="mes-modal-title text-red-600">Xác nhận kết thúc ca làm việc</h3>
          </div>
          <button type="button" className="mes-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mes-modal-body text-xs text-slate-600 space-y-2">
          <p>
            Bạn có chắc chắn muốn kết thúc phiên làm việc tại <strong>Trạm Sorting/Rework G01</strong>?
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs">
            Hệ thống sẽ đồng bộ toàn bộ tiến độ, sản lượng và đóng phiên chấm công ca hiện tại.
          </div>
        </div>

        <div className="mes-modal-footer">
          <button type="button" className="mes-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            type="button"
            className="mes-btn-confirm-red"
            onClick={() => {
              onConfirm && onConfirm();
              onClose();
            }}
          >
            <Power size={14} className="mr-1 inline" />
            Đồng ý kết thúc ca
          </button>
        </div>
      </div>
    </div>
  );
}
