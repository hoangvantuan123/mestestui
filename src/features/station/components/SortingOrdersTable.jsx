import React from 'react';
import { Eye } from 'lucide-react';
import './sorting-orders-table.css';

const columns = [
  ['Trạng thái', 'status'], ['Lệnh công đoạn', ''],
  ['Số lệnh thao tác', ''], ['Thao tác sản xuất', ''],
  ['Mã hàng', ''], ['Tên vật tư', 'product'],
  ['SL cần đạt', 'number'], ['SL cần sản xuất', 'number'], ['Đvt', 'center'],
  ['Máy', ''], ['Số part', 'number'], ['Ghi chú', 'note'], ['Bắt đầu', ''],
  ['Kết thúc', ''], ['TG vận hành máy', 'number'], ['Thao tác cuối', 'center'], ['', 'center'],
];
const qty = value => typeof value === 'number' ? value.toLocaleString('vi-VN') : value || '—';

export default function SortingOrdersTable({ orders = [], selectedOrderId, onSelectOrder, checkedOrderIds = [], onToggleCheckOrder, onToggleCheckAll, onOpenOrderDetail }) {
  const allChecked = !!orders.length && orders.every(o => checkedOrderIds.includes(o.id));
  const someChecked = orders.some(o => checkedOrderIds.includes(o.id)) && !allChecked;
  return (
    <div className="table-responsive-container sorting-orders-scroll">
      <table className="mes-data-table sorting-orders-grid">
        <thead><tr>{columns.map(([title, align], index) => <th key={index} className={`sorting-cell-${align}`}>
          {index === 0 && <input type="checkbox" className="mes-checkbox" aria-label="Chọn tất cả lệnh Sorting" checked={allChecked} ref={el => { if (el) el.indeterminate = someChecked; }} onChange={onToggleCheckAll} />}{title}
        </th>)}</tr></thead>
        <tbody>
          {!orders.length && <tr><td colSpan={17} className="empty-table-cell">Không tìm thấy lệnh phù hợp với bộ lọc.</td></tr>}
          {orders.map(order => {
            const select = () => { if (!window.getSelection()?.toString().trim()) onSelectOrder(order); };
            return <React.Fragment key={order.id}>
              <tr className={`mes-table-row ${selectedOrderId === order.id ? 'row-selected-active' : ''} ${checkedOrderIds.includes(order.id) ? 'row-checked' : ''}`} onClick={select}>
                <td className="sorting-cell-status"><input type="checkbox" className="mes-checkbox" aria-label={`Chọn ${order.stepOrder}`} checked={checkedOrderIds.includes(order.id)} onClick={e => e.stopPropagation()} onChange={() => onToggleCheckOrder(order.id)} /><span className={`status-pill ${order.status === 'Hoàn thành' ? 'status-success' : order.status === 'Đang chạy' ? 'status-running' : 'status-waiting'}`}>{order.status}</span></td>
                <td><button type="button" className="step-order-link" onClick={e => { e.stopPropagation(); onSelectOrder(order); onOpenOrderDetail?.(order); }}>{order.stageOrder || order.stepOrder}</button></td>
                <td>{order.operationOrder || '—'}</td><td>{order.operation || 'Phân loại Sorting'}</td>
                <td>{order.productCode}</td>
                <td className="sorting-cell-product" title={order.productName}>{order.productName}</td>
                <td className="sorting-cell-number">{qty(order.targetQty)}</td><td className="sorting-cell-number">{qty(order.productionQty)}</td>
                <td className="sorting-cell-center">{order.unit || 'Pcs'}</td><td>{order.machine || 'SORT-G01'}</td><td className="sorting-cell-number">{order.partCount ?? '—'}</td>
                <td className="sorting-cell-note" title={order.note || order.description}>{order.note || order.description || '—'}</td>
                <td>{order.startTime || '—'}</td><td>{order.endTime || '—'}</td><td className="sorting-cell-number">{order.machineRunTime || '00:00'}</td>
                <td className="sorting-cell-center">{order.lastOperation || '—'}</td>
                <td className="sorting-cell-center"><button type="button" className="action-open-link" title="Xem chi tiết lệnh" aria-label={`Mở ${order.stepOrder}`} onClick={e => { e.stopPropagation(); onSelectOrder(order); onOpenOrderDetail?.(order); }}><Eye size={14} />Mở</button></td>
              </tr>
            </React.Fragment>;
          })}
        </tbody>
      </table>
    </div>
  );
}
