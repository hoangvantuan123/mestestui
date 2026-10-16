import React, { useEffect, useRef, useState } from 'react';
import { X, ClipboardCheck, Info, AlertTriangle, Check, Lock, Plus } from 'lucide-react';
import { productionMaterials, errorCodes, fmt } from '../data/demoProduction';
import ProductionErrorRows from './ProductionErrorRows';

let nextRow = 1;
const newError = (qty, code = 'NG-001') => ({ id: nextRow++, code, deptCode: 'SX-CARTON', qty });
const total = rows => rows.reduce((sum, r) => sum + r.qty, 0);
const amount = value => Math.max(0, Math.trunc(Number(value) || 0));

export default function CompleteProductionModal({ order, onClose, onConfirm }) {
  const dialog = useRef(null);
  const initialScrap = Math.max(0, order.plannedQty - order.goodQty);
  const [tab, setTab] = useState('common');
  const [finish, setFinish] = useState('partial');
  const [mode, setMode] = useState('detail');
  const [process, setProcess] = useState({ good: order.goodQty, scrap: initialScrap });
  const [delivery, setDelivery] = useState({ good: order.goodQty, scrap: initialScrap });
  const [note, setNote] = useState('');
  const [general, setGeneral] = useState(() => [newError(initialScrap)]);
  const [materials, setMaterials] = useState(() => productionMaterials.map(m => ({ ...m, errors: [newError(initialScrap)] })));
  const [expanded, setExpanded] = useState([0]);
  const [feedback, setFeedback] = useState('');
  const target = delivery.scrap;
  const generalTotal = total(general);
  const matched = mode === 'general' ? generalTotal === target : materials.every(m => total(m.errors) <= target);

  useEffect(() => { const node = dialog.current; node.showModal(); return () => node.close(); }, []);
  const updateDelivery = (field, value) => {
    const qty = amount(value);
    setDelivery(d => ({ ...d, [field]: qty })); setFeedback('');
    if (field === 'scrap') setMaterials(list => list.map(m => {
      let remaining = qty;
      return { ...m, errors: m.errors.map(r => { const n = Math.min(r.qty, remaining); remaining -= n; return { ...r, qty: n }; }) };
    }));
  };
  const addError = rows => {
    const remaining = Math.max(0, target - total(rows));
    if (!remaining) return rows;
    const code = errorCodes.find(c => !rows.some(r => r.code === c.code))?.code || errorCodes[0].code;
    return [...rows, newError(remaining, code)];
  };
  const setErrors = (index, errors) => { setMaterials(list => list.map((m, i) => i === index ? { ...m, errors } : m)); setFeedback(''); };
  const confirm = () => {
    if (!matched) { setTab('errors'); setFeedback(`Tổng lỗi chung (${fmt(generalTotal)}) phải khớp sản phẩm phế bàn giao (${fmt(target)}).`); return; }
    onConfirm({ orderId: order.id, finish, process, delivery, note, errorMode: mode, generalErrors: general, materials });
    onClose();
  };

  return (
    <dialog ref={dialog} className="overlay open production-completion-dialog" aria-labelledby="production-completion-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal" role="document">
        <div className="modal-head"><div className="modal-title-group"><div className="modal-icon-badge"><ClipboardCheck size={20} /></div><div><h2 className="modal-title" id="production-completion-title">Hoàn thành thao tác</h2><div className="modal-subtitle">{order.code} · {order.operation}</div></div></div><button type="button" className="btn-close-modal" onClick={onClose} aria-label="Đóng hoàn thành thao tác"><X size={22} /></button></div>
        <div className="modal-tabs" role="tablist" aria-label="Thông tin hoàn thành">
          <button type="button" role="tab" id="production-common-tab" aria-controls="production-common" aria-selected={tab === 'common'} className={`modal-tab-btn ${tab === 'common' ? 'active' : ''}`} onClick={() => setTab('common')}><Info size={15} />Thông tin chung</button>
          <button type="button" role="tab" id="production-errors-tab" aria-controls="production-errors" aria-selected={tab === 'errors'} className={`modal-tab-btn ${tab === 'errors' ? 'active' : ''}`} onClick={() => setTab('errors')}><AlertTriangle size={15} />Khai báo lỗi<span className="tab-badge">{fmt(target)} lỗi</span></button>
        </div>
        <div className="modal-body">
          {feedback && <div className="alert-toast error" role="alert">{feedback}</div>}
          <div hidden={tab !== 'common'} id="production-common" role="tabpanel" aria-labelledby="production-common-tab">
            <div className="modal-summary-grid"><div className="summary-card"><div className="label">Mã lệnh công đoạn</div><div className="value">{order.code}</div></div><div className="summary-card"><div className="label">Sản phẩm / Vật tư</div><div className="value">{order.productCode} · {order.productName}</div></div><div className="summary-card"><div className="label">Kế hoạch sản xuất</div><div className="value">{fmt(order.goodQty)} đạt / {fmt(order.plannedQty)} yêu cầu ({order.unit})</div></div></div>
            <fieldset className="production-finish-mode"><legend>Hình thức hoàn thành:</legend><div><label className="mode-label"><input type="radio" name="production-finish" value="partial" checked={finish === 'partial'} onChange={() => setFinish('partial')} />Hoàn thành 1 phần</label><label className="mode-label"><input type="radio" name="production-finish" value="all" checked={finish === 'all'} onChange={() => setFinish('all')} />Hoàn thành toàn bộ</label></div></fieldset>
            <div className="nvl-table-wrap production-summary-table"><table className="nvl-table"><thead><tr><th>Chỉ tiêu</th><th className="text-right">Sản phẩm tốt</th><th className="text-right">Sản phẩm phế</th><th className="text-right">Tổng cộng</th></tr></thead><tbody>
              <tr><td><strong>Sản lượng chế biến</strong></td><td><input className="form-input text-right" aria-label="Sản lượng chế biến tốt" type="number" min="0" value={process.good} onChange={e => setProcess(p => ({ ...p, good: amount(e.target.value) }))} /></td><td><input className="form-input text-right" aria-label="Sản lượng chế biến phế" type="number" min="0" value={process.scrap} onChange={e => setProcess(p => ({ ...p, scrap: amount(e.target.value) }))} /></td><td className="text-right font-bold">{fmt(process.good + process.scrap)}</td></tr>
              <tr><td><strong>Sản phẩm bàn giao công đoạn sau</strong></td><td><input className="form-input text-right" aria-label="Sản phẩm bàn giao tốt" type="number" min="0" value={delivery.good} onChange={e => updateDelivery('good', e.target.value)} /></td><td><input className="form-input text-right" aria-label="Sản phẩm bàn giao phế" type="number" min="0" value={delivery.scrap} onChange={e => updateDelivery('scrap', e.target.value)} /></td><td className="text-right font-bold">{fmt(delivery.good + delivery.scrap)}</td></tr>
            </tbody></table></div>
            <label className="production-note-label">Ghi chú bàn giao / ca sản xuất:<textarea className="form-input" rows={2} placeholder="Nhập ghi chú (nếu có)..." value={note} onChange={e => setNote(e.target.value)} /></label>
          </div>
          <div hidden={tab !== 'errors'} id="production-errors" role="tabpanel" aria-labelledby="production-errors-tab">
            <div className="mode-toggle-group"><div className="mode-options-wrap"><label className="mode-label"><input type="radio" name="production-error-mode" checked={mode === 'general'} onChange={() => { setMode('general'); setFeedback(''); }} />Khai báo chung</label><label className="mode-label"><input type="radio" name="production-error-mode" checked={mode === 'detail'} onChange={() => { setMode('detail'); setFeedback(''); }} />Khai báo chi tiết NVL</label></div><div className="mode-guide-tip"><Info size={14} /><span>Bấm <b>[+]</b> ở đầu dòng NVL để mở rộng danh sách chi tiết lỗi</span></div></div>
            {mode === 'general' ? <div><div className="nvl-table-wrap"><table className="general-table"><thead><tr><th>Mã lỗi sai hỏng</th><th>Bộ phận gây lỗi</th><th className="text-right">Số lượng lỗi</th><th /></tr></thead><tbody><ProductionErrorRows rows={general} onChange={rows => { setGeneral(rows); setFeedback(''); }} target={target} /></tbody></table></div><button type="button" className="btn-add-item" disabled={generalTotal >= target} onClick={() => setGeneral(addError)}>+ Thêm mã lỗi chung</button></div> :
              <div className="nvl-table-wrap"><table className="nvl-table production-material-table"><thead><tr><th className="text-center">#</th><th>Mã vật tư</th><th>Tên vật tư</th><th className="text-center">ĐVT</th><th className="text-right">SL chi tiết sai hỏng</th><th className="text-right">NVL thu hồi (khoá)</th></tr></thead><tbody>
                {materials.map((m, index) => { const sum = total(m.errors), open = expanded.includes(index); return <React.Fragment key={m.code}><tr className={`nvl-master-row ${open ? 'row-active' : ''}`}><td className="text-center"><button type="button" className={`btn-toggle-expand ${open ? 'is-expanded' : ''}`} aria-expanded={open} aria-label={`${open ? 'Thu gọn' : 'Mở rộng'} lỗi ${m.code}`} onClick={() => setExpanded(ids => open ? ids.filter(i => i !== index) : [...ids, index])}>{open ? '−' : '+'}</button></td><td><span className="sub-mat-tag">{m.code}</span></td><td><strong>{m.name}</strong></td><td className="text-center text-muted font-bold">{m.unit}</td><td><input className="form-input text-right input-error-qty font-bold" readOnly aria-label={`Tổng lỗi ${m.code}`} value={fmt(sum)} /></td><td><div className="locked-input-wrap"><Lock className="locked-icon-svg" size={14} /><input className="form-input-locked" readOnly aria-label={`NVL thu hồi ${m.code}`} value={fmt(Math.max(0, target - sum))} /></div></td></tr>
                  {open && <tr className="nvl-detail-row"><td colSpan={6}><div className="sub-table-container"><table className="sub-detail-table"><thead><tr><th>#</th><th>Mã sai lỗi</th><th>Tên sai lỗi</th><th>Số lượng sai lỗi</th><th>Bộ phận gây lỗi</th><th>Tên bộ phận</th><th /></tr></thead><tbody><ProductionErrorRows detailed rows={m.errors} onChange={rows => setErrors(index, rows)} target={target} /></tbody></table><div className="sub-table-footer"><button type="button" className="btn-add-sub-error" disabled={sum >= target} onClick={() => setErrors(index, addError(m.errors))}><Plus size={13} />Thêm dòng lỗi cho {m.code}</button><div>Tổng lỗi đã khai báo: <strong>{fmt(sum)}</strong> / <strong>{fmt(target)}</strong></div></div></div></td></tr>}
                </React.Fragment>; })}
              </tbody></table></div>}
            <div className="modal-totals-bar"><div className="totals-info-group"><div className="totals-stat-pill"><span>SP phế bàn giao:</span><strong>{fmt(target)}</strong></div>{mode === 'general' && <div className="totals-stat-pill"><span>Tổng lỗi đã nhập:</span><strong>{fmt(generalTotal)}</strong></div>}</div><div className={`status-tag ${matched ? 'tag-matched' : 'tag-unmatched'}`}>{matched ? <Check size={15} /> : <AlertTriangle size={15} />}<span>{!target && matched ? 'Không có sản phẩm phế (0 lỗi)' : mode === 'detail' ? `Đã khớp chi tiết NVL (${fmt(target)} SP phế)` : matched ? `Đã khớp số lượng (${fmt(generalTotal)}/${fmt(target)})` : `Chưa khớp số lượng (${fmt(generalTotal)}/${fmt(target)})`}</span></div></div>
          </div>
        </div>
        <div className="modal-footer"><button type="button" className="btn-modal-cancel" onClick={onClose}>Đóng</button><button type="button" className="btn-modal-submit" onClick={confirm}><Check size={16} />Đồng ý - Hoàn thành {finish === 'all' ? 'toàn bộ' : '1 phần'}</button></div>
      </section>
    </dialog>
  );
}
