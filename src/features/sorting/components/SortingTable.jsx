import React from 'react';
import { Eye } from 'lucide-react';

export default function SortingTable({
  orders = [],
  selectedOrderId,
  onSelectOrder,
  checkedOrderIds = [],
  onToggleCheckOrder,
  onToggleCheckAll,
  onOpenOrderDetail,
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
            <th className="col-step-order">Số lệnh công đoạn</th>
            <th className="col-date text-center">Ngày</th>
            <th className="col-stage text-center">Công đoạn</th>
            <th className="col-category">Phân loại</th>
            <th className="col-prod-code">Mã SP (Rework)</th>
            <th className="col-prod-name">Tên sản phẩm (Rework)</th>
            <th className="col-qty text-right">Số lượng (Rework)</th>
            <th className="col-desc">Diễn giải</th>
            <th className="col-time text-center">Bắt đầu</th>
            <th className="col-time text-center">Kết thúc</th>
            <th className="col-runtime text-center">Thời gian vận hành máy</th>
            <th className="col-action text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={14} className="empty-table-cell">
                Không tìm thấy lệnh công đoạn nào phù hợp với bộ lọc.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const isChecked = checkedOrderIds.includes(order.id);
              const isRMA = order.category?.includes('RMA');

              return (
                <tr
                  key={order.id}
                  className={`mes-table-row ${isSelected ? 'row-selected-active' : ''} ${
                    isChecked ? 'row-checked' : ''
                  }`}
                  onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.toString().trim().length > 0) return;
                    onSelectOrder(order);
                  }}
                >
                  {/* 1. Checkbox */}
                  <td
                    className="col-checkbox"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <input
                      type="checkbox"
                      className="mes-checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCheckOrder(order.id)}
                      aria-label={`Chọn lệnh #${order.id}`}
                    />
                  </td>

                  {/* 2. STT */}
                  <td className="col-stt text-center font-medium">{order.id}</td>

                  {/* 3. Trạng thái */}
                  <td className="col-status text-center">
                    <span
                      className={`status-pill ${
                        order.status === 'Hoàn thành'
                          ? 'status-success'
                          : order.status === 'Đang chạy'
                          ? 'status-running'
                          : 'status-waiting'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* 4. Số lệnh công đoạn */}
                  <td className="col-step-order">
                    <button
                      type="button"
                      className="step-order-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                        if (onOpenOrderDetail) onOpenOrderDetail(order);
                      }}
                    >
                      {order.stepOrder}
                    </button>
                  </td>

                  {/* 5. Ngày */}
                  <td className="col-date text-center font-mono text-slate-700">{order.date}</td>

                  {/* 6. Công đoạn */}
                  <td className="col-stage text-center">
                    <span className="stage-badge">{order.stage}</span>
                  </td>

                  {/* 7. Phân loại */}
                  <td className="col-category">
                    <span className={`category-tag ${isRMA ? 'cat-rma' : 'cat-internal'}`}>
                      <span className={`cat-dot ${isRMA ? 'dot-rma' : 'dot-internal'}`} />
                      {order.category}
                    </span>
                  </td>

                  {/* 8. Mã SP (Rework) */}
                  <td className="col-prod-code font-mono text-slate-800 font-medium">
                    {order.productCode}
                  </td>

                  {/* 9. Tên sản phẩm (Rework) */}
                  <td className="col-prod-name font-mono font-bold text-slate-900">
                    {order.productName}
                  </td>

                  {/* 10. Số lượng (Rework) */}
                  <td className="col-qty text-right font-mono font-bold text-slate-900">
                    {order.reworkQty}
                  </td>

                  {/* 11. Diễn giải */}
                  <td className="col-desc" title={order.description}>
                    <span className="desc-text">{order.description}</span>
                  </td>

                  {/* 12. Bắt đầu */}
                  <td className="col-time text-center text-slate-400">{order.startTime || '—'}</td>

                  {/* 13. Kết thúc */}
                  <td className="col-time text-center text-slate-400">{order.endTime || '—'}</td>

                  {/* 14. Thời gian vận hành máy */}
                  <td className="col-runtime text-center font-mono font-semibold text-slate-800">
                    {order.machineRunTime || '00:00'}
                  </td>

                  {/* 15. Thao tác Mở */}
                  <td
                    className="col-action text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order);
                      if (onOpenOrderDetail) onOpenOrderDetail(order);
                    }}
                  >
                    <button type="button" className="action-open-link" title="Xem chi tiết lệnh">
                      <Eye size={13} className="mr-0.5 inline" />
                      <span>Mở</span>
                    </button>
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
