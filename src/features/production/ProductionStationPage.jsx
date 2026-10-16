import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCw, Cloud, Maximize, User, Search, Eye, Play, Check, Package, Undo2, Download, Pause, Settings, ChartColumn, Printer, ArrowRightLeft, LogOut } from 'lucide-react';
import ChangeMachineModal from '../station/components/modals/ChangeMachineModal';
import CompleteProductionModal from './components/CompleteProductionModal';
import { productionOrders, fmt } from './data/demoProduction';
import './production.css';

export default function ProductionStationPage() {
  const navigate = useNavigate(), location = useLocation();
  const [orders, setOrders] = useState(() => productionOrders.map(o => ({ ...o })));
  const [selectedId, setSelectedId] = useState(productionOrders[0].id);
  const [checked, setChecked] = useState([productionOrders[0].id]);
  const [tab, setTab] = useState('running');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [showMachines, setShowMachines] = useState(false);
  const [completion, setCompletion] = useState(null);
  const [shiftTeam, setShiftTeam] = useState(location.state?.shiftTeam || null);
  const [message, setMessage] = useState('');
  const [online, setOnline] = useState(35300);
  const [quantity, setQuantity] = useState(0);
  const timer = useRef();
  useEffect(() => { const interval = setInterval(() => setOnline(n => n + 1), 1000); return () => { clearInterval(interval); clearTimeout(timer.current); }; }, []);
  const notice = text => { setMessage(text); clearTimeout(timer.current); timer.current = setTimeout(() => setMessage(''), 3500); };
  const list = orders.filter(o => (o.status === 'Hoàn thành') === (tab === 'completed') && (!status || o.status === status) && [o.code, o.operation, o.productCode, o.productName].join(' ').toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')));
  const current = list.find(o => o.id === selectedId) || list[0];
  const select = o => { setSelectedId(o.id); setChecked([o.id]); };
  const openComplete = o => { if (!o) return notice('Chọn một lệnh để hoàn thành.'); select(o); setCompletion(o); };
  const changeMachine = machine => {
    const team = { name: machine.team, leader: machine.leader, count: machine.members.length };
    setShiftTeam(team);
    if (machine.type !== 'production') navigate(`/${machine.type}`, { state: { shiftTeam: team } });
    else notice(`Đã xác nhận lên ca tại ${machine.name}.`);
  };
  const finishOrder = data => {
    setQuantity(n => n + data.delivery.good);
    if (data.finish === 'all') setOrders(list => list.map(o => o.id === data.orderId ? { ...o, status: 'Hoàn thành' } : o));
    notice(`Demo: đã ghi nhận hoàn thành ${data.finish === 'all' ? 'toàn bộ' : 'một phần'} — ${fmt(data.delivery.good)} đạt / ${fmt(data.delivery.scrap)} phế.`);
  };
  const dock = [
    [Play, 'Bắt đầu', '', true], [Check, 'Hoàn thành', 'primary-navy', false, () => openComplete(current)],
    [Package, 'Lấy vật liệu', 'primary-yellow', false, () => notice('Demo: lấy vật liệu sản xuất cho lệnh đang chọn.')],
    [Undo2, 'Hoàn vật tư', 'primary-navy', false, () => notice('Demo: hoàn trả vật tư thừa cho lệnh đang chọn.')],
    [Download, 'Tiếp nhận BTP', '', true],
    [Pause, 'Tạm dừng', 'primary-navy', !current || current.status === 'Hoàn thành', () => { if (current) setOrders(list => list.map(o => o.id === current.id ? { ...o, status: 'Tạm dừng' } : o)); }],
    [Settings, 'Vận hành máy', 'primary-navy', false, () => notice('Demo: máy bế thủ công 1800 sẵn sàng vận hành.')],
    [ChartColumn, 'Số liệu ca', 'primary-navy', false, () => notice(`Sản lượng ghi nhận trong phiên demo: ${fmt(quantity)} Pcs.`)],
    [Printer, 'In tem', '', true],
  ];
  return (
    <>
    <div className="production-station">
      <header className="app-header">
        <div className="header-left"><div className="machine-badge"><span className="status-dot" /><button type="button" className="machine-name production-machine-select" title="Đổi máy sản xuất thường" onClick={() => setShowMachines(true)}>Máy bế thủ công 1800</button><span className="machine-state">{current?.status === 'Đang chạy' ? 'Đang chạy' : 'Sẵn sàng'}</span><button type="button" className="btn-refresh" title="Làm mới trạng thái" onClick={() => notice('Đã làm mới trạng thái máy.')}><RotateCw size={14} /></button></div><div className="metrics-group">{[['SẢN LƯỢNG', `${fmt(quantity)} cái`], ['TỐC ĐỘ', '0 /h'], ['TB', '0 /h']].map(([label, value]) => <div className="metric-box" key={label}><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>)}</div></div>
        <div className="header-center"><h1 className="main-task-title">{current ? `${current.code} · ${current.operation.toUpperCase()}` : 'CHƯA CHỌN LỆNH SẢN XUẤT'}</h1></div>
        <div className="header-right"><button type="button" className="header-icon-btn" title="Đồng bộ đám mây" onClick={() => notice('Bản demo dùng dữ liệu mẫu, chưa kết nối máy chủ.')}><Cloud size={18} /></button><div className="logo-badge"><img src="/assets/goldsun/goldsun-icon.png" alt="" /><span>GOLDSUN</span></div><button type="button" className="header-icon-btn" title="Toàn màn hình" onClick={() => { const task = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); task?.catch(() => notice('Trình duyệt không cho phép toàn màn hình.')); }}><Maximize size={18} /></button><div className="user-profile"><div className="user-info"><div className="user-name">AD</div><div className="user-role">GSI · admin</div></div><div className="user-avatar"><User size={16} /></div></div></div>
      </header>
      <main className="main-container"><div className="top-nav-bar"><div className="tabs-header">{['running', 'completed'].map(t => <button type="button" key={t} className={`nav-tab-btn ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setStatus(''); }}>{t === 'running' ? 'Lệnh chạy' : 'Lệnh hoàn thành'} ({orders.filter(o => (o.status === 'Hoàn thành') === (t === 'completed')).length})</button>)}</div><div className="filter-toolbar"><div className="search-input-wrap"><input className="search-input" aria-label="Tìm lệnh sản xuất" placeholder="Tìm: Lệnh công đoạn / Thao tác SX / Mã hàng..." value={query} onChange={e => setQuery(e.target.value)} /></div><button type="button" className="btn-search" onClick={() => notice(`Tìm thấy ${list.length} lệnh.`)}><Search size={15} />Tìm</button><select className="status-dropdown" aria-label="Trạng thái lệnh sản xuất" value={status} onChange={e => setStatus(e.target.value)}><option value="">Trạng thái</option>{['Đang chạy', 'Tạm dừng', 'Chờ', 'Hoàn thành'].map(s => <option key={s}>{s}</option>)}</select></div></div>
        <div className="table-card"><div className="table-responsive"><table className="data-table"><thead><tr><th><input type="checkbox" className="custom-check" aria-label="Chọn tất cả lệnh sản xuất" checked={!!list.length && list.every(o => checked.includes(o.id))} onChange={e => setChecked(e.target.checked ? list.map(o => o.id) : [])} /></th><th>#</th><th>Trạng thái</th><th>Lệnh công đoạn</th><th>Thao tác sản xuất</th><th>Mã hàng</th><th>Tên vật tư</th><th className="text-right">SL cần đạt</th><th className="text-right">SL cần sản xuất</th><th className="text-center">Đvt</th><th>Máy</th><th className="text-center">Số part</th><th>Ghi chú</th><th>Bắt đầu</th><th className="text-center">Thao tác</th></tr></thead><tbody>
          {list.map((o, i) => <tr key={o.id} className={current?.id === o.id ? 'row-selected' : ''} onClick={() => select(o)}><td onClick={e => e.stopPropagation()}><input type="checkbox" className="custom-check" aria-label={`Chọn ${o.code}`} checked={checked.includes(o.id)} onChange={e => setChecked(ids => e.target.checked ? [...ids, o.id] : ids.filter(id => id !== o.id))} /></td><td className="text-muted">{i + 1}</td><td><span className={`badge ${o.status === 'Đang chạy' ? 'badge-running' : o.status === 'Tạm dừng' ? 'badge-paused' : 'badge-waiting'}`}>{o.status}</span></td><td className="col-order-code">{o.code}</td><td>{o.operation}</td><td>{o.productCode}</td><td>{o.productName}</td><td className="text-right">{fmt(o.goodQty)}</td><td className="text-right">{fmt(o.plannedQty)}</td><td className="text-center text-muted">{o.unit}</td><td>{o.machine}</td><td className="text-center">{o.parts}</td><td className="text-muted">{o.note}</td><td>{o.start}</td><td className="text-center"><button type="button" className="col-action-btn" aria-label={`Mở ${o.code}`} onClick={e => { e.stopPropagation(); openComplete(o); }}><Eye size={14} />Mở</button></td></tr>)}
          {!list.length && <tr><td colSpan={15} className="production-empty">Không có lệnh phù hợp.</td></tr>}
        </tbody></table></div><div className="pagination-container"><div>{list.length} lệnh thao tác</div><div className="pagination-pages"><button type="button" className="page-btn" disabled aria-label="Trang trước">&lt;</button><button type="button" className="page-btn active">1</button><button type="button" className="page-btn" disabled aria-label="Trang sau">&gt;</button></div><span className="production-demo-label">Dữ liệu mẫu · Máy sản xuất thường</span></div></div>
      </main>
      <div className="action-dock">{dock.map(([Icon, label, color, disabled, click]) => <button key={label} type="button" className="dock-item" disabled={disabled} onClick={click}><div className={`dock-circle ${disabled ? 'disabled' : color}`}><Icon size={22} /></div><span className="dock-label">{label}</span></button>)}</div>
      <footer className="app-footer"><div className="footer-left"><div className="footer-item"><span>Tổ:</span><strong>{shiftTeam?.name || 'Tổ HT Carton GSHN'}</strong></div><div className="footer-item"><span>Tổ trưởng:</span><span>{shiftTeam?.leader || '—'}</span></div><div className="footer-item"><span>Thành viên:</span><span>{shiftTeam?.count ?? '—'}</span></div></div><div className="footer-right"><div className="time-badge">Lên ca mẫu: 11:37 23/09/2026</div><div className="online-timer">Thời gian online: <b>{Math.floor(online / 3600)}h {String(Math.floor(online % 3600 / 60)).padStart(2, '0')}m {String(online % 60).padStart(2, '0')}s</b></div><button type="button" className="btn-footer-outline" onClick={() => setShowMachines(true)}><ArrowRightLeft size={14} />Chọn máy khác</button><button type="button" className="btn-footer-danger" onClick={() => { notice('Demo: chọn thiết bị và xác nhận thành viên để lên ca mới.'); setShowMachines(true); }}><LogOut size={14} />Kết thúc ca</button></div></footer>
      {message && <div className="production-toast" role="status">{message}</div>}
      {completion && <CompleteProductionModal order={completion} onClose={() => setCompletion(null)} onConfirm={finishOrder} />}
    </div>
    <ChangeMachineModal isOpen={showMachines} onClose={() => setShowMachines(false)} onSelectMachine={changeMachine} />
    </>
  );
}
