import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import './receive-roll-materials.css';

const warehouses = [
  { id: 'GS1-VLP-01', name: 'Kho vật liệu phụ' },
  { id: 'GS1-NVL-01', name: 'Kho nguyên vật liệu' },
  { id: 'GS1-PXU-01', name: 'Kho tại phân xưởng' },
];
const number = value => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 }).format(value);
const round = value => Math.round(value * 1e6) / 1e6;

export default function ReceiveRollMaterialsModal({ orders, requested, onClose, onConfirm }) {
  const dialog = useRef(null);
  // NVL chính là chính mã hàng của lệnh đang lấy vật liệu.
  const [rows, setRows] = useState(() => orders.map(order => ({
    id: order.id, orderId: order.id, orderCode: order.code, operation: order.operation,
    code: order.productCode, name: order.productName, unit: order.unit,
    planned: order.plannedQty, stock: 0, primary: true, original: '—',
  })).map(material => {
    const proposed = requested[material.orderId]?.[material.code] || 0;
    const remaining = Math.max(0, round(material.planned - proposed));
    return { ...material, proposed, remaining, selected: false, quantity: String(remaining), source: material.primary ? 'GS1-NVL-01' : 'GS1-VLP-01', destination: 'GS1-PXU-01' };
  }));
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    return () => node.close();
  }, []);
  const update = (id, patch) => setRows(list => list.map(row => row.id === id ? { ...row, ...patch } : row));
  const selected = rows.filter(row => row.selected);
  const valid = selected.length > 0 && selected.every(row => Number.isFinite(Number(row.quantity)) && Number(row.quantity) > 0 && row.source && row.destination && row.source !== row.destination);
  const allSelected = rows.every(row => row.selected);
  const confirm = event => {
    event.preventDefault();
    if (!valid) return;
    onConfirm(selected.map(row => ({ ...row, quantity: round(Number(row.quantity)), withinPlan: Math.min(Number(row.quantity), row.remaining), overPlan: Math.max(0, round(Number(row.quantity) - row.remaining)) })));
    onClose();
  };
  return (
    <dialog ref={dialog} className="roll-material-dialog" aria-labelledby="roll-material-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={confirm}>
        <header className="rm-header">
          <h2 id="roll-material-title">Nhận vật liệu — {orders.length === 1 ? orders[0].code : `${orders.length} lệnh đã chọn`}</h2>
          <button type="button" className="rm-close" aria-label="Đóng nhận vật liệu" onClick={onClose}><X size={16} /></button>
        </header>
        <div className="rm-body">
          <div className="rm-table-scroll">
            <table className="rm-table">
              <colgroup>{[28, 32, 112, 105, 170, 158, 158, 78, 78, 78, 92, 50, 70, 155, 108].map((width, index) => <col key={index} style={{ width }} />)}</colgroup>
              <thead><tr>
                <th>#</th><th><input type="checkbox" aria-label="Chọn tất cả vật liệu" checked={allSelected} ref={node => { if (node) node.indeterminate = selected.length > 0 && !allSelected; }} onChange={event => setRows(list => list.map(row => ({ ...row, selected: event.target.checked })))} /></th>
                <th>Công đoạn</th><th>Mã vật tư</th><th>Tên vật liệu</th><th>Kho xuất</th><th>Kho nhập</th><th className="rm-numeric">SL theo<br />lệnh</th><th className="rm-numeric">SL đã đề<br />nghị</th><th className="rm-numeric">SL đã xuất<br />kho</th><th className="rm-numeric">SL còn phải đề<br />nghị</th><th>Đơn vị</th><th className="rm-numeric">Tồn kho</th><th>Message</th><th>SL yêu cầu</th>
              </tr></thead>
              <tbody>{rows.map((row, index) => {
                const qty = Number(row.quantity);
                const invalid = row.selected && (!Number.isFinite(qty) || qty <= 0 || row.source === row.destination);
                const over = qty > row.remaining;
                return <tr key={row.id} className={row.selected ? 'rm-selected' : ''}>
                  <td>{index + 1}</td><td><input type="checkbox" aria-label={`Chọn vật liệu ${row.code} — ${row.orderCode}`} checked={row.selected} onChange={event => update(row.id, { selected: event.target.checked })} /></td>
                  <td title={`${row.orderCode} · ${row.operation}`}>{row.orderCode}</td><td>{row.code}</td><td title={row.name}>{row.name}</td>
                  <td><select aria-label={`Kho xuất ${row.code} — ${row.orderCode}`} value={row.source} onChange={event => update(row.id, { source: event.target.value })}>{warehouses.map(warehouse => <option key={warehouse.id} value={warehouse.id}>{warehouse.id} — {warehouse.name}</option>)}</select></td>
                  <td><select aria-label={`Kho nhập ${row.code} — ${row.orderCode}`} value={row.destination} onChange={event => update(row.id, { destination: event.target.value })}>{warehouses.map(warehouse => <option key={warehouse.id} value={warehouse.id}>{warehouse.id} — {warehouse.name}</option>)}</select></td>
                  <td className="rm-numeric">{number(row.planned)}</td><td className="rm-numeric rm-muted">{number(row.proposed)}</td><td className="rm-numeric rm-muted">0</td><td className="rm-numeric rm-remaining">{number(row.remaining)}</td><td>{row.unit}</td><td className="rm-numeric">{number(row.stock)}</td>
                  <td className="rm-message">{invalid ? <span className="rm-error">{row.source === row.destination ? 'Kho xuất và nhập phải khác nhau.' : 'Nhập số lượng lớn hơn 0.'}</span> : row.selected && over ? <span className="rm-warning">Vượt lệnh {number(round(qty - row.remaining))} {row.unit} · Chờ duyệt</span> : ''}</td>
                  <td><input className="rm-quantity" type="number" min="0.000001" step="0.000001" aria-label={`SL yêu cầu ${row.code} — ${row.orderCode}`} disabled={!row.selected} required={row.selected} value={row.quantity} onChange={event => update(row.id, { quantity: event.target.value })} /></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <p className="rm-note">Hệ thống tách phiếu theo <b>NVL chính/phụ</b> và <b>xuất theo lệnh / xuất vượt lệnh</b>. Phần xuất theo lệnh chuyển <b>“Chờ xuất”</b>; phần xuất vượt lệnh ở trạng thái <b>“Chờ duyệt”</b>. Dữ liệu mẫu chưa đồng bộ Bravo.</p>
        </div>
        <footer className="rm-footer"><button type="button" className="rm-cancel" onClick={onClose}>Hủy bỏ</button><button type="submit" className="rm-confirm" disabled={!valid}>Đồng ý nhận vật liệu</button></footer>
      </form>
    </dialog>
  );
}
