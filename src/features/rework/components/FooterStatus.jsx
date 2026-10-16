import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Power } from 'lucide-react';

export default function FooterStatus({
  team = 'TỔ SX G01',
  leader = '—',
  members = '—',
  shiftStart = '10:23 16/10/2026',
  onChangeMachine,
  onEndShift,
}) {
  const [onlineSeconds, setOnlineSeconds] = useState(3723); // starts at 01h 02m 03s

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatOnlineTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
  };

  return (
    <footer className="mes-footer-status">
      {/* Left team & worker metadata */}
      <div className="footer-left-meta">
        <span className="meta-item">
          <strong className="text-white">Tổ:</strong> {team}
        </span>
        <span className="meta-divider">|</span>
        <span className="meta-item">
          <strong className="text-white">Tổ trưởng:</strong> {leader}
        </span>
        <span className="meta-divider">|</span>
        <span className="meta-item">
          <strong className="text-white">Thành viên:</strong> {members}
        </span>
      </div>

      {/* Right shift info & actions */}
      <div className="footer-right-actions">
        <span className="shift-time-text">
          <span className="text-slate-400">Lần ca:</span> {shiftStart}
        </span>
        <span className="meta-divider">|</span>
        <span className="online-time-text">
          <span className="text-slate-400">Thời gian online:</span>{' '}
          <span className="font-mono text-emerald-400 font-semibold">
            {formatOnlineTime(onlineSeconds)}
          </span>
        </span>

        {/* Button: Chọn máy khác */}
        <button
          type="button"
          className="btn-select-machine"
          onClick={onChangeMachine}
          title="Chọn sang máy khác"
        >
          <SlidersHorizontal size={14} className="mr-1.5" />
          <span>Chọn máy khác</span>
        </button>

        {/* Button: Kết thúc ca */}
        <button
          type="button"
          className="btn-end-shift"
          onClick={onEndShift}
          title="Đóng phiên làm việc ca này"
        >
          <Power size={14} className="mr-1.5" />
          <span>Kết thúc ca</span>
        </button>
      </div>
    </footer>
  );
}
