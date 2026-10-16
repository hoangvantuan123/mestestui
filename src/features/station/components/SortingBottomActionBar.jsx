import React from 'react';
import {
  Play,
  CheckCircle2,
  Barcode,
  Layers,
  AlertTriangle,
  Pause,
  Settings,
  ArrowUpDown,
  Printer,
} from 'lucide-react';

export default function SortingBottomActionBar({
  activeOrder,
  onStartOrder,
  onCompleteOrder,
  onQuickScan,
  onDefectMatrix,
  onChangeTray,
  onPauseOrder,
  onMachineOperate,
  onChangeOrderSeq,
  onPrintLabel,
}) {
  const isRunning = activeOrder?.status === 'Đang chạy' || activeOrder?.status === 'Đang sort';
  const hasActive = Boolean(activeOrder);

  return (
    <div className="bottom-action-panel">
      <div className="action-buttons-track">
        {/* 1. Bắt đầu Sort */}
        <div className="action-item">
          <button
            type="button"
            className={`action-circle-btn ${isRunning ? 'active-green' : 'btn-disabled'}`}
            onClick={onStartOrder}
            title={isRunning ? 'Đang thực hiện phân loại' : 'Bắt đầu lệnh Sorting'}
          >
            <Play size={18} />
          </button>
          <span className="action-item-label">Bắt đầu sort</span>
        </div>

        {/* 2. Hoàn thành Lô */}
        <div className="action-item">
          <button
            type="button"
            className={`action-circle-btn ${hasActive ? 'btn-green-highlight' : 'btn-disabled'}`}
            onClick={onCompleteOrder}
            title="Nghiệm thu & Hoàn thành Lô Sorting"
          >
            <CheckCircle2 size={19} />
          </button>
          <span className="action-item-label font-semibold text-slate-800">Hoàn thành lô</span>
        </div>

        {/* 3. Quét & Phân loại nhanh (Blue Highlighted Circle) */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-blue-highlight"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)',
              border: '2px solid #60a5fa',
            }}
            onClick={onQuickScan}
            title="Quét Barcode / Nhập nhanh kết quả kiểm tra"
          >
            <Barcode size={20} />
          </button>
          <span className="action-item-label font-semibold text-blue-900">Quét & Nhập</span>
        </div>

        {/* 4. Đổi khay / thùng */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn"
            onClick={onChangeTray}
            title="Đổi khay đựng / Chuyển Pallet mới"
          >
            <Layers size={18} />
          </button>
          <span className="action-item-label">Đổi khay/thùng</span>
        </div>

        {/* 5. Phân loại lỗi NG */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn"
            onClick={onDefectMatrix}
            title="Cơ cấu phân loại lỗi ngoại quan (Bụi, Xước, Móp...)"
          >
            <AlertTriangle size={18} />
          </button>
          <span className="action-item-label">Phân loại lỗi</span>
        </div>

        {/* 6. Tạm dừng */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn"
            onClick={onPauseOrder}
            title="Tạm dừng phiên sorting"
          >
            <Pause size={18} />
          </button>
          <span className="action-item-label">Tạm dừng</span>
        </div>

        {/* 7. Vận hành máy */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn"
            onClick={onMachineOperate}
            title="Trạng thái máy phân loại"
          >
            <Settings size={18} />
          </button>
          <span className="action-item-label">Vận hành máy</span>
        </div>

        {/* 8. Đổi thứ tự lệnh */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn"
            onClick={onChangeOrderSeq}
            title="Ưu tiên lô sorting này lên đầu"
          >
            <ArrowUpDown size={18} />
          </button>
          <span className="action-item-label">Đổi thứ tự</span>
        </div>

        {/* 9. In tem nhãn thùng */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn"
            onClick={onPrintLabel}
            title="In tem định danh Lô / Tem QC Đạt"
          >
            <Printer size={18} />
          </button>
          <span className="action-item-label">In nhãn thùng</span>
        </div>
      </div>
    </div>
  );
}
