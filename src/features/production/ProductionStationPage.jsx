import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCw, Cloud, Maximize, User, Search, Eye, Play, Check, Package, Undo2, Download, Pause, Settings, ChartColumn, Printer, ArrowRightLeft, LogOut } from 'lucide-react';
import ChangeMachineModal, { MACHINE_LIST } from '../station/components/modals/ChangeMachineModal';
import CompleteProductionModal from './components/CompleteProductionModal';
import ReceiveRollMaterialsModal from './components/ReceiveRollMaterialsModal';
import { productionOrders, rollCuttingOrders, fmt } from './data/demoProduction';
import { materialProgress } from './data/materialProgress';
import './production.css';

export default function ProductionStationPage() {
  const location = useLocation();
  const machineId = new URLSearchParams(location.search).get('machine');
  const machine = MACHINE_LIST.find(m => m.type === 'production' && m.id === machineId) || MACHINE_LIST[0];
  return <ProductionStation key={machine.id} machine={machine} />;
}

function ProductionStation({ machine }) {
  const initialOrders = machine.id === 'HN-XC-01' ? rollCuttingOrders : productionOrders;
  const navigate = useNavigate(), location = useLocation();
  const [orders, setOrders] = useState(() => initialOrders.map(o => ({ ...o })));
  const [selectedId, setSelectedId] = useState(initialOrders[0].id);
  const [checked, setChecked] = useState([initialOrders[0].id]);
  const [tab, setTab] = useState('running');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [showMachines, setShowMachines] = useState(false);
  const [completion, setCompletion] = useState(null);
  const [materialOrders, setMaterialOrders] = useState(null);
  const [materialRequests, setMaterialRequests] = useState({});
  const [shiftTeam, setShiftTeam] = useState(location.state?.shiftTeam || null);
  const [message, setMessage] = useState('');
  const [online, setOnline] = useState(35300);
  const [quantity, setQuantity] = useState(0);
  const timer = useRef();
  useEffect(() => { const interval = setInterval(() => setOnline(n => n + 1), 1000); return () => { clearInterval(interval); clearTimeout(timer.current); }; }, []);
  const notice = text => { setMessage(text); clearTimeout(timer.current); timer.current = setTimeout(() => setMessage(''), 3500); };
  const list = orders.filter(o => (o.status === 'Hoàn thành') === (tab === 'completed') && (!status || (machine.id === 'HN-XC-01' ? materialProgress(o, materialRequests).label : o.status) === status) && [o.code, o.operation, o.productCode, o.productName].join(' ').toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')));
  const current = list.find(o => o.id === selectedId) || list[0];
  const materialSelection = list.filter(o => checked.includes(o.id) && o.status !== 'Hoàn thành');
  const select = o => { setSelectedId(o.id); setChecked([o.id]); };
  const openComplete = o => { if (!o) return notice('Chọn một lệnh để hoàn thành.'); select(o); setCompletion(o); };
  const changeMachine = machine => {
    const team = { name: machine.team, leader: machine.leader, count: machine.members.length };
    setShiftTeam(team);
    navigate(`/${machine.type}${machine.type === 'production' ? `?machine=${encodeURIComponent(machine.id)}` : ''}`, { state: { shiftTeam: team } });
  };
  const finishOrder = data => {
    setQuantity(n => n + data.delivery.good);
    if (data.finish === 'all') setOrders(list => list.map(o => o.id === data.orderId ? { ...o, status: 'Hoàn thành' } : o));
    notice(`Demo: đã ghi nhận hoàn thành ${data.finish === 'all' ? 'toàn bộ' : 'một phần'} — ${fmt(data.delivery.good)} đạt / ${fmt(data.delivery.scrap)} phế.`);
  };
  const dock = [
    [Play, 'Bắt đầu', '', true], [Check, 'Hoàn thành', 'primary-navy', false, () => openComplete(current)],
    [Package, 'Lấy vật liệu', 'primary-yellow', machine.id === 'HN-XC-01' ? !materialSelection.length : !current || current.status === 'Hoàn thành', () => machine.id === 'HN-XC-01' ? setMaterialOrders(materialSelection) : notice('Demo: lấy vật liệu sản xuất cho lệnh đang chọn.')],
    [Undo2, 'Hoàn vật tư', 'primary-navy', false, () => notice('Demo: hoàn trả vật tư thừa cho lệnh đang chọn.')],
    [Download, 'Tiếp nhận BTP', '', true],
    [Pause, 'Tạm dừng', 'primary-navy', !current || current.status === 'Hoàn thành', () => { if (current) setOrders(list => list.map(o => o.id === current.id ? { ...o, status: 'Tạm dừng' } : o)); }],
    [Settings, 'Vận hành máy', 'primary-navy', false, () => notice(`Demo: ${machine.name} sẵn sàng vận hành.`)],
    [ChartColumn, 'Số liệu ca', 'primary-navy', false, () => notice(`Sản lượng ghi nhận trong phiên demo: ${fmt(quantity)}.`)],
    [Printer, 'In tem', '', true],
  ].filter(([, label]) => machine.id !== 'HN-XC-01' || !['Bắt đầu', 'Hoàn thành', 'Tiếp nhận BTP', 'Tạm dừng'].includes(label));
  return (
    <>
    <div className="production-station">
      <header className="app-header">
        <div className="header-left"><div className="machine-badge"><span className="status-dot" /><button type="button" className="machine-name production-machine-select" title="Đổi máy sản xuất thường" onClick={() => setShowMachines(true)}>{machine.name}</button><span className="machine-state">{current?.status === 'Đang chạy' ? 'Đang chạy' : 'Sẵn sàng'}</span><button type="button" className="btn-refresh" title="Làm mới trạng thái" onClick={() => notice('Đã làm mới trạng thái máy.')}><RotateCw size={14} /></button></div><div className="metrics-group">{[['SẢN LƯỢNG', `${fmt(quantity)} ${current?.unit || initialOrders[0].unit}`], ['TỐC ĐỘ', '0 /h'], ['TB', '0 /h']].map(([label, value]) => <div className="metric-box" key={label}><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>)}</div></div>
        <div className="header-center"><h1 className="main-task-title">{current ? `${current.code} · ${current.operation.toUpperCase()}` : 'CHƯA CHỌN LỆNH SẢN XUẤT'}</h1></div>
        <div className="header-right"><button type="button" className="header-icon-btn" title="Đồng bộ đám mây" onClick={() => notice('Bản demo dùng dữ liệu mẫu, chưa kết nối máy chủ.')}><Cloud size={18} /></button><div className="logo-badge"><img src="/assets/goldsun/goldsun-icon.png" alt="" /><span>GOLDSUN</span></div><button type="button" className="header-icon-btn" title="Toàn màn hình" onClick={() => { const task = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); task?.catch(() => notice('Trình duyệt không cho phép toàn màn hình.')); }}><Maximize size={18} /></button><div className="user-profile"><div className="user-info"><div className="user-name">AD</div><div className="user-role">GSI · admin</div></div><div className="user-avatar"><User size={16} /></div></div></div>
      </header>
      <main className="main-container"><div className="top-nav-bar"><div className="tabs-header">{['running', 'completed'].map(t => <button type="button" key={t} className={`nav-tab-btn ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setStatus(''); }}>{t === 'running' ? 'Lệnh chạy' : 'Lệnh hoàn thành'} ({orders.filter(o => (o.status === 'Hoàn thành') === (t === 'completed')).length})</button>)}</div><div className="filter-toolbar"><div className="search-input-wrap"><input className="search-input" aria-label="Tìm lệnh sản xuất" placeholder="Tìm: Lệnh công đoạn / Thao tác SX / Mã hàng..." value={query} onChange={e => setQuery(e.target.value)} /></div><button type="button" className="btn-search" onClick={() => notice(`Tìm thấy ${list.length} lệnh.`)}><Search size={15} />Tìm</button><select className="status-dropdown" aria-label={machine.id === 'HN-XC-01' ? 'Tình trạng lấy NVL' : 'Trạng thái lệnh sản xuất'} value={status} onChange={e => setStatus(e.target.value)}><option value="">{machine.id === 'HN-XC-01' ? 'Tình trạng lấy NVL' : 'Trạng thái'}</option>{(machine.id === 'HN-XC-01' ? ['Chưa lấy NVL', 'Đã lấy một phần', 'Đã lấy đủ'] : ['Đang chạy', 'Tạm dừng', 'Chờ', 'Hoàn thành']).map(s => <option key={s}>{s}</option>)}</select></div></div>
        <div className="table-card"><div className="table-responsive"><table className="data-table"><thead><tr><th><input type="checkbox" className="custom-check" aria-label="Chọn tất cả lệnh sản xuất" checked={!!list.length && list.every(o => checked.includes(o.id))} onChange={e => setChecked(e.target.checked ? list.map(o => o.id) : [])} /></th><th>#</th><th>{machine.id === 'HN-XC-01' ? 'Tình trạng lấy NVL' : 'Trạng thái'}</th><th>Lệnh công đoạn</th>{machine.id !== 'HN-XC-01' && <th>Thao tác sản xuất</th>}<th>Mã hàng</th><th>Tên vật tư</th><th className="text-right">{machine.id === 'HN-XC-01' ? <>SL hàng trước<br />khi xả</> : 'SL cần đạt'}</th><th className="text-right">{machine.id === 'HN-XC-01' ? <>SL hàng sau khi<br />sản xuất/Xả cuộn</> : 'SL cần sản xuất'}</th><th className="text-center">Đvt</th><th>Máy</th><th className="text-center">Số part</th><th>Ghi chú</th><th>Bắt đầu</th><th className="text-center">Thao tác</th></tr></thead><tbody>
          {list.map((o, i) => <tr key={o.id} className={current?.id === o.id ? 'row-selected' : ''} onClick={() => select(o)}><td onClick={e => e.stopPropagation()}><input type="checkbox" className="custom-check" aria-label={`Chọn ${o.code}`} checked={checked.includes(o.id)} onChange={e => setChecked(ids => e.target.checked ? [...ids, o.id] : ids.filter(id => id !== o.id))} /></td><td className="text-muted">{i + 1}</td><td>{machine.id === 'HN-XC-01' ? <div className="material-progress"><span className={'badge badge-' + materialProgress(o, materialRequests).tone}>{materialProgress(o, materialRequests).label}</span><span className="material-progress-quantity">{fmt(materialProgress(o, materialRequests).quantity)} / {fmt(o.plannedQty)} {o.unit}</span></div> : <span className={`badge ${o.status === 'Đang chạy' ? 'badge-running' : o.status === 'Tạm dừng' ? 'badge-paused' : 'badge-waiting'}`}>{o.status}</span>}</td><td className="col-order-code">{o.code}</td>{machine.id !== 'HN-XC-01' && <td>{o.operation}</td>}<td>{o.productCode}</td><td>{o.productName}</td><td className="text-right">{fmt(o.goodQty)}</td><td className="text-right">{fmt(o.plannedQty)}</td><td className="text-center text-muted">{o.unit}</td><td>{o.machine}</td><td className="text-center">{o.parts}</td><td className="text-muted">{o.note}</td><td>{o.start}</td><td className="text-center"><button type="button" className="col-action-btn" aria-label={`Mở ${o.code}`} onClick={e => { e.stopPropagation(); openComplete(o); }}><Eye size={14} />Mở</button></td></tr>)}
          {!list.length && <tr><td colSpan={machine.id === 'HN-XC-01' ? 14 : 15} className="production-empty">Không có lệnh phù hợp.</td></tr>}
        </tbody></table></div><div className="pagination-container"><div>{list.length} lệnh thao tác</div><div className="pagination-pages"><button type="button" className="page-btn" disabled aria-label="Trang trước">&lt;</button><button type="button" className="page-btn active">1</button><button type="button" className="page-btn" disabled aria-label="Trang sau">&gt;</button></div><span className="production-demo-label">Dữ liệu mẫu · {machine.typeName}</span></div></div>
      </main>
      <div className="action-dock">{dock.map(([Icon, label, color, disabled, click]) => <button key={label} type="button" className="dock-item" disabled={disabled} onClick={click}><div className={`dock-circle ${disabled ? 'disabled' : color}`}><Icon size={22} /></div><span className="dock-label">{label}</span></button>)}</div>
      <footer className="app-footer"><div className="footer-left"><div className="footer-item"><span>Tổ:</span><strong>{shiftTeam?.name || machine.line}</strong></div><div className="footer-item"><span>Tổ trưởng:</span><span>{shiftTeam?.leader || '—'}</span></div><div className="footer-item"><span>Thành viên:</span><span>{shiftTeam?.count ?? '—'}</span></div></div><div className="footer-right"><div className="time-badge">Lên ca mẫu: 11:37 23/09/2026</div><div className="online-timer">Thời gian online: <b>{Math.floor(online / 3600)}h {String(Math.floor(online % 3600 / 60)).padStart(2, '0')}m {String(online % 60).padStart(2, '0')}s</b></div><button type="button" className="btn-footer-outline" onClick={() => setShowMachines(true)}><ArrowRightLeft size={14} />Chọn máy khác</button><button type="button" className="btn-footer-danger" onClick={() => { notice('Demo: chọn thiết bị và xác nhận thành viên để lên ca mới.'); setShowMachines(true); }}><LogOut size={14} />Kết thúc ca</button></div></footer>
      {message && <div className="production-toast" role="status">{message}</div>}
      {completion && <CompleteProductionModal order={completion} onClose={() => setCompletion(null)} onConfirm={finishOrder} />}
      {materialOrders && <ReceiveRollMaterialsModal orders={materialOrders} requested={materialRequests} onClose={() => setMaterialOrders(null)} onConfirm={rows => {
        setMaterialRequests(requests => {
          const next = { ...requests };
          rows.forEach(row => {
            const previous = next[row.orderId] || {};
            next[row.orderId] = { ...previous, [row.code]: Math.round(((previous[row.code] || 0) + row.quantity) * 1e6) / 1e6 };
          });
          return next;
        });
        notice(`Demo: đã ghi nhận đề nghị ${rows.length} vật liệu${rows.some(row => row.overPlan > 0) ? ' · Phần vượt lệnh chờ duyệt' : ' · Chờ xuất'}.`);
      }} />}
    </div>
    <ChangeMachineModal isOpen={showMachines} onClose={() => setShowMachines(false)} onSelectMachine={changeMachine} />
    </>
  );
}
