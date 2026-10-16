import React from 'react';
import { Eye, Barcode, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function SortingDataTable({
  orders = [],
  selectedOrderId,
  onSelectOrder,
  checkedOrderIds = [],
  onToggleCheckOrder,
  onToggleCheckAll,
  onOpenOrderDetail,
  onOpenQuickScan,
}) {
  const isAllChecked = orders.length > 0 && orders.every((o) => checkedOrderIds.includes(o.id));
  const isSomeChecked = orders.some((o) => checkedOrderIds.includes(o.id)) && !isAllChecked;

  return (
    <div className="table-responsive-container">
      <table className="mes-data-table">
        <thead>
          <tr>
            <th className="col-checkbox">
              <input
                type="checkbox"
                className="mes-checkbox"
                checked={isAllChecked}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeChecked;
                }}
                onChange={onToggleCheckAll}
                aria-label="Chọn tất cả"
              />
            </th>
            <th className="col-stt text-center">#</th>
            <th className="col-status text-center">Trạng thái</th>
            <th className="col-step-order">Số lệnh Sorting</th>
            <th className="col-lot text-center">Mã Lot / Khay</th>
            <th className="col-prod-code">Mã sản phẩm</th>
            <th className="col-prod-name">Tên sản phẩm</th>
            <th className="col-target text-right">SL Kế hoạch</th>
            <th className="col-sorted text-right">Đã Sort</th>
            <th className="col-good text-right">Đạt (OK)</th>
            <th className="col-defect text-right">Lỗi (NG)</th>
            <th className="col-yield text-center">Tỉ lệ Đạt (%)</th>
            <th className="col-defects text-center">Cơ cấu lỗi ngoại quan</th>
            <th className="col-time text-center">Bắt đầu</th>
            <th className="col-action text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={15} className="empty-table-cell">
                Không tìm thấy lệnh sorting nào phù hợp với bộ lọc.
              </td>
            </tr>
          ) : (
            orders.map((order, idx) => {
              const isSelected = order.id === selectedOrderId;
              const isChecked = checkedOrderIds.includes(order.id);
              const passRateNum = parseFloat(order.passRate) || 0;

              return (
                <tr
                  key={order.id}
                  className={`mes-table-row ${isSelected ? 'row-selected' : ''} ${
                    isChecked ? 'row-checked' : ''
                  }`}
                  onClick={() => onSelectOrder(order)}
                >
                  {/* 1. Checkbox */}
                  <td className="col-checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="mes-checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCheckOrder(order.id)}
                      aria-label={`Chọn lệnh ${order.stepOrder}`}
                    />
                  </td>

                  {/* 2. STT */}
                  <td className="col-stt text-center">{idx + 1}</td>

                  {/* 3. Status */}
                  <td className="col-status text-center">
                    <span
                      className={`status-badge ${
                        order.status === 'Đang chạy' || order.status === 'Đang sort'
                          ? 'status-running'
                          : order.status === 'Tạm dừng'
                          ? 'status-paused'
                          : order.status === 'Hoàn thành'
                          ? 'status-completed'
                          : 'status-waiting'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* 4. Step Order / Sorting Order */}
                  <td className="col-step-order">
                    <div className="font-semibold text-blue-700">{order.stepOrder}</div>
                    <div className="text-[11px] text-slate-500">{order.category}</div>
                  </td>

                  {/* 5. Lot / Tray */}
                  <td className="col-lot text-center">
                    <div className="font-bold text-slate-800 text-xs">{order.lotNo || '—'}</div>
                    <div className="inline-flex items-center gap-1 text-[11px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-medium mt-0.5">
                      <Layers size={10} />
                      {order.currentTray || 'Khay 1'}
                    </div>
                  </td>

                  {/* 6. Product Code */}
                  <td className="col-prod-code font-mono text-xs font-semibold text-slate-800">
                    {order.productCode}
                  </td>

                  {/* 7. Product Name */}
                  <td className="col-prod-name text-xs text-slate-700 font-medium">
                    {order.productName}
                  </td>

                  {/* 8. Target Qty */}
                  <td className="col-target text-right font-mono font-semibold text-slate-700">
                    {Number(order.targetQty).toLocaleString('vi-VN')}
                  </td>

                  {/* 9. Sorted Qty */}
                  <td className="col-sorted text-right font-mono font-bold text-blue-700">
                    {Number(order.sortedQty).toLocaleString('vi-VN')}
                  </td>

                  {/* 10. Good Qty (OK) */}
                  <td className="col-good text-right font-mono font-bold text-emerald-700 bg-emerald-50/40">
                    {Number(order.goodQty).toLocaleString('vi-VN')}
                  </td>

                  {/* 11. Defect Qty (NG) */}
                  <td className="col-defect text-right font-mono font-bold text-rose-700 bg-rose-50/40">
                    {Number(order.defectQty).toLocaleString('vi-VN')}
                  </td>

                  {/* 12. Yield % */}
                  <td className="col-yield text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`font-bold text-xs ${
                          passRateNum >= 97
                            ? 'text-emerald-700'
                            : passRateNum > 0
                            ? 'text-amber-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {order.passRate}%
                      </span>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${
                            passRateNum >= 97
                              ? 'bg-emerald-500'
                              : passRateNum > 0
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${Math.min(100, passRateNum)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 13. Defect Breakdown */}
                  <td className="col-defects text-center">
                    {order.defects && (order.defects.scratch || order.defects.dust || order.defects.dent || order.defects.bubble) ? (
                      <div className="flex items-center justify-center gap-1 text-[10px]">
                        {order.defects.dust > 0 && (
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium" title="Lỗi Bụi/Dị vật">
                            Bụi: {order.defects.dust}
                          </span>
                        )}
                        {order.defects.scratch > 0 && (
                          <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-medium" title="Lỗi Xước bề mặt">
                            Xước: {order.defects.scratch}
                          </span>
                        )}
                        {order.defects.dent > 0 && (
                          <span className="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded font-medium" title="Lỗi Móp méo">
                            Móp: {order.defects.dent}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* 14. Start Time */}
                  <td className="col-time text-center text-xs text-slate-600 font-mono">
                    {order.startTime}
                  </td>

                  {/* 15. Action */}
                  <td className="col-action text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        onClick={() => onOpenOrderDetail(order)}
                        title="Xem chi tiết lệnh"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        onClick={() => onOpenQuickScan(order)}
                        title="Quét mã & Phân loại nhanh"
                      >
                        <Barcode size={15} />
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
  );
}
