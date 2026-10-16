import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCw,
  Cloud,
  Maximize,
  Minimize,
  User,
  LayoutGrid,
  Wrench,
  SearchCheck,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

export default function Header({
  activeOrder,
  onRefresh,
  stationType = 'rework', // 'rework' | 'sorting'
  stationName = 'Trạm Rework G01',
  currentMachine = 'RWK-G01',
  status = 'Sẵn sàng',
  metrics = { quantity: '0 CT', speed: '0 /h', teamSpeed: '0 /h' },
  operator = { name: 'HOÀNG VĂN TUẤN', role: 'to_operator' },
  onOpenChangeMachine,
}) {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="mes-header">
      {/* Left Section: Station info & quick KPI metrics */}
      <div className="mes-header-left">
        <div className="station-brand">
          <span className="status-pulse-dot" />

          {/* Station Switcher Pill */}
          <div className="station-switcher-group flex items-center bg-slate-900/90 rounded-md p-0.5 border border-slate-700">
            <button
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                stationType === 'rework'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => navigate('/rework')}
              title="Chuyển sang Trạm Rework"
            >
              <Wrench size={13} />
              <span>REWORK</span>
            </button>

            <button
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                stationType === 'sorting'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => navigate('/sorting')}
              title="Chuyển sang Trạm Sorting"
            >
              <SearchCheck size={13} />
              <span>SORTING</span>
            </button>
          </div>

          {/* Current Machine Badge with Quick Change Trigger */}
          <button
            type="button"
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 px-2 py-0.5 rounded text-xs text-slate-200 transition-colors ml-1"
            onClick={onOpenChangeMachine}
            title="Nhấp để đổi máy sản xuất"
          >
            <span className="font-semibold text-emerald-400">{currentMachine}</span>
            <span className="text-[11px] text-slate-300 hidden md:inline">• {stationName}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          <span className="station-status-text">{status}</span>

          <button
            type="button"
            className={`refresh-btn ${isRefreshing ? 'spin' : ''}`}
            onClick={handleRefreshClick}
            title="Làm mới dữ liệu trạm"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Small KPI badges */}
        <div className="header-kpis">
          <div className="kpi-mini-box">
            <span className="kpi-label">{stationType === 'sorting' ? 'ĐÃ SORT' : 'SẢN LƯỢNG'}</span>
            <span className="kpi-value">{metrics.quantity}</span>
          </div>
          <div className="kpi-mini-box">
            <span className="kpi-label">{stationType === 'sorting' ? 'TỶ LỆ ĐẠT' : 'TỐC ĐỘ'}</span>
            <span className="kpi-value">{metrics.speed}</span>
          </div>
          <div className="kpi-mini-box">
            <span className="kpi-label">{stationType === 'sorting' ? 'LỖI NG' : 'TỔ'}</span>
            <span className="kpi-value">{metrics.teamSpeed}</span>
          </div>
        </div>
      </div>

      {/* Center Section: Main Selected Order Headline */}
      <div className="mes-header-center">
        <h1 className="active-order-headline">
          {activeOrder
            ? `${activeOrder.stepOrder} - ${(activeOrder.category || activeOrder.operation || '').toUpperCase()}`
            : 'CHƯA CHỌN LỆNH THAO TÁC'}
        </h1>
      </div>

      {/* Right Section: Cloud status & Operator profile */}
      <div className="mes-header-right">
        {/* Cloud sync icon badge */}
        <div className="cloud-indicator" title="Máy chủ đám mây đã đồng bộ">
          <div className="cloud-pill">
            <Cloud size={16} className="cloud-icon" />
            <span className="cloud-dot" />
          </div>
        </div>

        {/* App grid */}
        <button
          type="button"
          className="header-icon-btn"
          title="Đổi trạm / Máy"
          onClick={onOpenChangeMachine}
        >
          <SlidersHorizontal size={16} />
        </button>

        {/* User avatar & info */}
        <div className="user-profile">
          <div className="user-avatar-circle">
            <User size={15} />
          </div>
          <div className="user-info-text">
            <span className="user-name">{operator.name}</span>
            <span className="user-role">{operator.role}</span>
          </div>
        </div>

        {/* Fullscreen button */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        >
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </button>
      </div>
    </header>
  );
}
