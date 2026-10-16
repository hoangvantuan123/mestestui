import React, { useState } from 'react';
import { Eye, Package, ChevronDown, ChevronUp } from 'lucide-react';

export default function SortingTable({
  orders = [],
  selectedOrderId,
  onSelectOrder,
  checkedOrderIds = [],
  onToggleCheckOrder,
  onToggleCheckAll,
  onOpenOrderDetail,
  stationType = 'rework',
}) {
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const isSorting = stationType === 'sorting';

  const toggleExpand = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

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
            <th className="col-prod-code">
              {isSorting ? 'Mã SP (Con hàng)' : 'Mã SP (Rework)'}
            </th>
            <th className="col-prod-name">
              {isSorting ? 'Tên con hàng chính' : 'Tên sản phẩm (Rework)'}
            </th>
            <th className="col-qty text-right">
              {isSorting ? 'Số lượng (Sorting)' : 'Số lượng (Rework)'}
            </th>
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

              const isExpanded = expandedOrderIds.includes(order.id);
              const hasMultipleProducts = order.products && order.products.length > 1;

              return (
                <React.Fragment key={order.id}>
                  <tr
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

                    {/* 8. Mã SP */}
                    <td className="col-prod-code font-mono text-slate-800 font-medium">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{order.productCode}</span>
                        {hasMultipleProducts && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(order.id);
                            }}
                            className="inline-flex items-center gap-1 text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 transition-colors cursor-pointer"
                            title="Nhấp để xem danh sách các con hàng chính trong lệnh"
                          >
                            <Package size={11} className="text-blue-700" />
                            <span>{order.products.length} con hàng</span>
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* 9. Tên sản phẩm */}
                    <td className="col-prod-name font-mono font-bold text-slate-900">
                      {order.productName}
                    </td>

                    {/* 10. Số lượng */}
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

                  {/* Dòng mở rộng: Danh sách các con hàng chính trong lệnh (Không dùng NVL) */}
                  {isExpanded && order.products && (
                    <tr className="bg-blue-50/60 border-b-2 border-blue-300">
                      <td colSpan={15} className="py-2.5 px-4 pl-12">
                        <div className="bg-white rounded border border-blue-300 p-3 shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-bold text-blue-900 flex items-center gap-2">
                              <Package size={15} className="text-blue-700" />
                              <span>
                                Danh sách {order.products.length} con hàng chính cấu thành trong lệnh {order.stepOrder}:
                              </span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Lệnh Sorting không sử dụng NVL phụ tùng
                              </span>
                            </div>
                            <span className="text-xs text-slate-600 font-mono">
                              Tổng sản lượng lệnh: <strong className="text-slate-900 font-bold">{order.reworkQty} Pcs</strong>
                            </span>
                          </div>

                          <table className="w-full text-xs border border-slate-200 rounded">
                            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                              <tr>
                                <th className="py-1 px-2.5 text-center w-10">#</th>
                                <th className="py-1 px-2.5 text-left w-48">Mã con hàng chính</th>
                                <th className="py-1 px-2.5 text-left">Tên sản phẩm</th>
                                <th className="py-1 px-2.5 text-right w-36">SL Cần Sorting</th>
                                <th className="py-1 px-2.5 text-center w-20">ĐVT</th>
                                <th className="py-1 px-2.5 text-left">Diễn giải kiểm tra lỗi ngoại quan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {order.products.map((item, pIdx) => (
                                <tr key={item.itemCode} className="hover:bg-blue-50/50 transition-colors">
                                  <td className="py-1.5 px-2.5 text-center text-slate-400 font-mono font-medium">
                                    {pIdx + 1}
                                  </td>
                                  <td className="py-1.5 px-2.5 font-mono font-bold text-blue-900">
                                    {item.itemCode}
                                  </td>
                                  <td className="py-1.5 px-2.5 font-medium text-slate-800">
                                    {item.itemName}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900">
                                    {item.qty?.toLocaleString('vi-VN')}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-center text-slate-600 font-medium">
                                    {item.unit || 'Pcs'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-slate-600">
                                    {item.description || 'Kiểm tra ngoại quan 100%'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
