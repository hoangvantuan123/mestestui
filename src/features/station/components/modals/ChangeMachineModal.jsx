import React, { useEffect, useRef, useState } from 'react';
import { X, UsersRound, UserRound, LogIn, RotateCcw, Check } from 'lucide-react';
import './change-machine.css';

export const MACHINE_LIST = [
  { id: 'HN-BE-TC01', name: 'Máy bế thủ công 1800', type: 'production', typeName: 'Sản xuất thường', stage: 'CD05', line: 'Tổ HT Carton GSHN', status: 'Sẵn sàng', orderInRun: 'CD05-0926-0743(512)' },
  { id: 'RWK-G01', name: 'Trạm Rework Sửa chữa G01', type: 'rework', typeName: 'Rework', stage: 'CDRE', line: 'Line G01 - PX1B', status: 'Sẵn sàng', orderInRun: 'CDRE-0626-0008' },
  { id: 'SORT-G01', name: 'Trạm Sorting Phân loại Ngoại quan G01', type: 'sorting', typeName: 'Sorting', stage: 'CDSO', line: 'Line ST01 - PX QC', status: 'Sẵn sàng', orderInRun: 'CDSO-0626-0006' },
];

const MEMBER_NAMES = [
  ['dp_hungBQ', 'BÙI QUANG HÙNG'], ['duongmanhhuy', 'DƯƠNG MẠNH HUY'],
  ['dp_thanhHT', 'HOÀNG THỊ THANH'], ['hoangvantuan', 'HOÀNG VĂN TUẤN'],
  ['haminhhuong', 'HÀ MINH HƯƠNG'], ['IT02', 'IT02'],
  ['lehoanghuuduc', 'LÊ HOÀNG HỮU ĐỨC'], ['lequangminh', 'LÊ QUANG MINH'],
  ['levietha', 'LÊ VIỆT HÀ'], ['nguyennhuquynh', 'NGUYỄN NHƯ QUỲNH'],
  ['nguyenvanan', 'NGUYỄN VĂN AN'], ['tranthilan', 'TRẦN THỊ LAN'],
  ['phamvanhai', 'PHẠM VĂN HẢI'], ['vuthimai', 'VŨ THỊ MAI'],
  ['dangvanlong', 'ĐẶNG VĂN LONG'], ['buitrungnam', 'BÙI TRUNG NAM'],
  ['ngothithu', 'NGÔ THỊ THU'], ['dovanphuc', 'ĐỖ VĂN PHÚC'],
  ['tranminhduc', 'TRẦN MINH ĐỨC'], ['nguyenhongnhung', 'NGUYỄN HỒNG NHUNG'],
  ['lethihuong', 'LÊ THỊ HƯƠNG'], ['phanvanhung', 'PHAN VĂN HƯNG'],
  ['hoangthiyen', 'HOÀNG THỊ YẾN'], ['vuminhtuan', 'VŨ MINH TUẤN'],
  ['nguyenthilinh', 'NGUYỄN THỊ LINH'], ['tranhongson', 'TRẦN HỒNG SƠN'],
  ['phamthinha', 'PHẠM THỊ NGA'],
];
const MEMBERS = MEMBER_NAMES.map(([id, name]) => ({ id, name }));
const TEAMS = [
  { id: 'gs1', name: 'Tổ SX GS1', leader: 'Ops Admin', members: MEMBERS },
  { id: 'gs2', name: 'Tổ SX GS2', leader: 'Nguyễn Văn An', members: MEMBERS.slice(10, 18) },
];

export default function ChangeMachineModal({ isOpen, onClose, onSelectMachine }) {
  const dialog = useRef(null);
  const [machineId, setMachineId] = useState('');
  const [teamId, setTeamId] = useState('gs1');
  const [memberIds, setMemberIds] = useState(MEMBERS.map(m => m.id));
  const [draftIds, setDraftIds] = useState([]);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const team = TEAMS.find(t => t.id === teamId);
  const selectedMembers = team.members.filter(m => memberIds.includes(m.id));

  useEffect(() => {
    if (isOpen) {
      setMachineId(''); setTeamId('gs1'); setMemberIds(MEMBERS.map(m => m.id));
      setEditing(false); setExpanded(false); setQuery(''); setMessage('');
      if (!dialog.current.open) dialog.current.showModal();
    } else if (dialog.current.open) dialog.current.close();
  }, [isOpen]);

  const changeTeam = e => {
    const next = TEAMS.find(t => t.id === e.target.value);
    setTeamId(next.id); setMemberIds(next.members.map(m => m.id));
    setExpanded(false); setEditing(false); setMessage('');
  };
  const editMembers = () => { setDraftIds([...memberIds]); setQuery(''); setEditing(true); };
  const confirm = e => {
    e.preventDefault();
    const machine = MACHINE_LIST.find(m => m.id === machineId);
    if (!machine || !selectedMembers.length) return;
    onSelectMachine?.({ ...machine, team: team.name, leader: team.leader, members: selectedMembers });
    onClose();
  };

  return (
    <dialog ref={dialog} className="shift-screen" aria-labelledby="shift-title" onCancel={e => { e.preventDefault(); onClose(); }}>
      <button className="shift-close" type="button" onClick={onClose} aria-label="Đóng đổi máy"><X size={22} /></button>
      <div className="shift-content">
        <div className="shift-brand">
          <div className="shift-logo"><img src="/assets/goldsun/goldsun-icon.png" alt="" /><b>GOLDSUN</b></div>
          <div><strong>SMART FACTORY</strong><span>Kết nối mọi khả năng</span></div>
        </div>
        <h2 id="shift-title">Đăng nhập thành công. Vui lòng xác nhận tất cả thành viên đã<br className="shift-desktop-break" /> chọn để lên ca.</h2>
        <form onSubmit={confirm}>
          <div className="shift-card">
            <div className="shift-device-row">
              <label htmlFor="shift-device"><em>*</em> Thiết bị:</label>
              <select id="shift-device" required value={machineId} onChange={e => { setMachineId(e.target.value); setMessage(''); }}>
                <option value="" disabled>Chọn thiết bị</option>
                {MACHINE_LIST.map(m => <option key={m.id} value={m.id}>{m.id} · {m.name}</option>)}
              </select>
            </div>
            <section className="shift-team-panel" aria-label="Tổ sản xuất và thành viên">
              <div className="shift-team-row">
                <label htmlFor="shift-team"><em>*</em> Tổ:</label>
                <select id="shift-team" value={teamId} onChange={changeTeam}>{TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                <span>Tổ trưởng: <b>{team.leader}</b></span>
              </div>
              <div className="shift-members-row">
                <span className="shift-members-label">Thành viên ({selectedMembers.length}):</span>
                <div className="shift-member-tags">
                  {(expanded ? selectedMembers : selectedMembers.slice(0, 10)).map(m => (
                    <span className="shift-member-tag" key={m.id}><UserRound size={13} />{m.id} · {m.name}</span>
                  ))}
                  {!selectedMembers.length && <span className="shift-empty">Chưa chọn thành viên. Vui lòng điều chỉnh trước khi lên ca.</span>}
                  {selectedMembers.length > 10 && <button className="shift-more" type="button" onClick={() => setExpanded(!expanded)}>{expanded ? 'Thu gọn' : `+${selectedMembers.length - 10} thành viên khác...`}</button>}
                </div>
              </div>
              {editing && (
                <section className="shift-member-editor" aria-label="Điều chỉnh thành viên">
                  <div className="shift-editor-head"><b>Điều chỉnh thành viên</b><span>Đã chọn {draftIds.length}/{team.members.length}</span></div>
                  <input aria-label="Tìm thành viên" placeholder="Tìm tên hoặc tài khoản..." value={query} onChange={e => setQuery(e.target.value)} />
                  <div className="shift-editor-tools"><button type="button" onClick={() => setDraftIds(team.members.map(m => m.id))}>Chọn tất cả</button><button type="button" onClick={() => setDraftIds([])}>Bỏ chọn tất cả</button></div>
                  <div className="shift-member-options">
                    {team.members.filter(m => `${m.id} ${m.name}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))).map(m => (
                      <label key={m.id}><input type="checkbox" checked={draftIds.includes(m.id)} onChange={e => setDraftIds(ids => e.target.checked ? [...ids, m.id] : ids.filter(id => id !== m.id))} /><span>{m.id} · {m.name}</span></label>
                    ))}
                  </div>
                  <div className="shift-editor-actions"><button type="button" onClick={() => setEditing(false)}>Hủy</button><button type="button" onClick={() => { setMemberIds([...draftIds]); setEditing(false); }}><Check size={14} />Áp dụng</button></div>
                </section>
              )}
            </section>
          </div>
          {message && <p className="shift-message" role="status">{message}</p>}
          <div className="shift-actions">
            <button className="shift-adjust" type="button" onClick={editMembers}><UsersRound size={14} />Điều chỉnh thành viên</button>
            <button className="shift-login" type="button" onClick={() => { setMachineId(''); setMessage('Bản demo: vui lòng chọn lại thiết bị và xác nhận thành viên.'); setEditing(false); }}><RotateCcw size={14} />Đăng nhập lại</button>
            <button className="shift-confirm" type="submit" disabled={!machineId || !selectedMembers.length || editing}><LogIn size={15} />Xác nhận lên ca</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
