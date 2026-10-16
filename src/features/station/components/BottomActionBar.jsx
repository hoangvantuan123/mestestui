import React from 'react';
import {
  Play,
  CheckCircle2,
  Package,
  RotateCcw,
  Inbox,
  Pause,
  Settings,
  ArrowUpDown,
  Printer,
} from 'lucide-react';

export default function BottomActionBar({
  activeOrder,
  onStartOrder,
  onCompleteOrder,
  completionCount = 0,
  onGetMaterial,
  onFinishDefect,
  onReceiveLTT,
  onPauseOrder,
  onMachineOperate,
  onChangeOrderSeq,
  onPrintLabel,
}) {
  const isRunning = activeOrder?.status === 'Đang chạy';
  const hasActive = Boolean(activeOrder);

  return (
    <div className="bottom-action-panel">
      <div className="action-buttons-track">
        {/* 1. Bắt đầu */}
        <div className="action-item">
          <button
            type="button"
            className={`action-circle-btn ${isRunning ? 'active-green' : 'btn-disabled'}`}
            onClick={onStartOrder}
            title={isRunning ? 'Đang thực hiện' : 'Bắt đầu lệnh'}
          >
            <Play size={18} />
          </button>
          <span className="action-item-label">Bắt đầu</span>
        </div>

        {/* 2. Hoàn thành */}
        <div className="action-item">
          <button
            type="button"
            className={`action-circle-btn ${hasActive ? 'btn-green-highlight' : 'btn-disabled'}`}
            onClick={onCompleteOrder}
            title="Nghiệm thu & Hoàn thành lệnh"
            aria-label={completionCount > 1 ? `Hoàn thành (${completionCount})` : 'Hoàn thành'}
          >
            <CheckCircle2 size={19} />
          </button>
          <span className="action-item-label font-semibold text-slate-800">Hoàn thành{completionCount > 1 ? ` (${completionCount})` : ''}</span>
        </div>

        {/* 3. Lấy vật tư (Yellow Highlighted Circle) */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-yellow-highlight"
            onClick={onGetMaterial}
            title="Lấy vật tư cho lệnh"
          >
            <Package size={20} />
          </button>
          <span className="action-item-label font-semibold text-slate-800">Lấy vật tư</span>
        </div>

        {/* 4. Hoàn tất lỗi (Blue Highlighted Circle) */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-blue-highlight"
            onClick={onFinishDefect}
            title="Hoàn tất xử lý lỗi"
          >
            <RotateCcw size={19} />
          </button>
          <span className="action-item-label font-semibold text-slate-800">Hoàn tất lỗi</span>
        </div>

        {/* 5. Tiếp nhận LTT */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-disabled"
            onClick={onReceiveLTT}
            title="Tiếp nhận lệnh thao tác"
          >
            <Inbox size={18} />
          </button>
          <span className="action-item-label">Tiếp nhận LTT</span>
        </div>

        {/* 6. Tạm dừng */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-disabled"
            onClick={onPauseOrder}
            title="Tạm dừng lệnh"
          >
            <Pause size={18} />
          </button>
          <span className="action-item-label">Tạm dừng</span>
        </div>

        {/* 7. Vận hành máy */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-disabled"
            onClick={onMachineOperate}
            title="Vận hành máy"
          >
            <Settings size={18} />
          </button>
          <span className="action-item-label">Vận hành máy</span>
        </div>

        {/* 8. Đổi thứ tự (Navy Highlighted Circle) */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-navy-highlight"
            onClick={onChangeOrderSeq}
            title="Đổi thứ tự ưu tiên lệnh"
          >
            <ArrowUpDown size={19} />
          </button>
          <span className="action-item-label font-semibold text-slate-800">Đổi thứ tự</span>
        </div>

        {/* 9. In tem */}
        <div className="action-item">
          <button
            type="button"
            className="action-circle-btn btn-disabled"
            onClick={onPrintLabel}
            title="In tem nhãn hàng"
          >
            <Printer size={18} />
          </button>
          <span className="action-item-label">In tem</span>
        </div>
      </div>
    </div>
  );
}
