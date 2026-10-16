import React from 'react';
import { Trash2 } from 'lucide-react';
import { errorCodes, departments } from '../data/demoProduction';

export default function ProductionErrorRows({ rows, onChange, target, detailed = false }) {
  const total = rows.reduce((sum, r) => sum + r.qty, 0);
  const update = (id, patch) => onChange(rows.map(r => r.id === id ? { ...r, ...patch } : r));
  const quantity = (row, value) => {
    const max = Math.max(0, target - (total - row.qty));
    update(row.id, { qty: Math.min(max, Math.max(0, Math.trunc(Number(value) || 0))) });
  };
  return rows.length ? rows.map((row, i) => (
    <tr key={row.id}>
      {detailed && <td className="text-center text-muted font-bold">{i + 1}</td>}
      <td><select className="form-select" aria-label="Mã sai lỗi" value={row.code} onChange={e => update(row.id, { code: e.target.value })}>{errorCodes.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}</select></td>
      {detailed && <td><input className="form-input" aria-label="Tên sai lỗi" readOnly value={errorCodes.find(c => c.code === row.code)?.name || ''} /></td>}
      {detailed && <td><input type="number" min="0" step="1" className="form-input input-error-qty" aria-label="Số lượng sai lỗi" value={row.qty} onChange={e => quantity(row, e.target.value)} /></td>}
      <td><select className="form-select" aria-label="Bộ phận gây lỗi" value={row.deptCode} onChange={e => update(row.id, { deptCode: e.target.value })}>{departments.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}</select></td>
      {detailed && <td><input className="form-input" aria-label="Tên bộ phận" readOnly value={departments.find(d => d.code === row.deptCode)?.name || ''} /></td>}
      {!detailed && <td><input type="number" min="0" step="1" className="form-input input-error-qty" aria-label="Số lượng lỗi chung" value={row.qty} onChange={e => quantity(row, e.target.value)} /></td>}
      <td className="text-center"><button type="button" className="btn-remove-row" aria-label={`Xóa dòng lỗi ${i + 1}`} onClick={() => onChange(rows.filter(r => r.id !== row.id))}><Trash2 size={14} /></button></td>
    </tr>
  )) : <tr><td colSpan={detailed ? 7 : 4} className="no-error-notice">Chưa có dòng lỗi. Bấm “Thêm dòng lỗi” để khai báo.</td></tr>;
}
