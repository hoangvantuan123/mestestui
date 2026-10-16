import React, { useState } from 'react';
import { RotateCw, Cloud, Maximize, Minimize, User, LayoutGrid, SlidersHorizontal } from 'lucide-react';

export default function Header({
  activeOrder,
  onRefresh,
  stationName = 'Trạm Rework G01',
  status = 'Sẵn sàng',
  metrics = { quantity: '0 CT', speed: '0 /h', teamSpeed: '0 /h' },
  operator = { name: 'HOÀNG VĂN TUẤN', role: 'to_operator' },
  stationType = 'rework',
  currentMachine = 'RW-G01',
  onChangeMachine,
}) {
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
        <div className="station-brand flex items-center gap-2">
          <span className="status-pulse-dot" />
          <span className="station-title">{stationName}</span>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${
              stationType === 'sorting'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
            }`}
          >
            {stationType === 'sorting' ? 'Máy Sorting' : 'Máy Rework'}
          </span>
          {onChangeMachine && (
            <button
              type="button"
              onClick={onChangeMachine}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded cursor-pointer transition-colors"
              title="Đổi sang máy Rework hoặc Sorting khác"
            >
              <SlidersHorizontal size={11} className="text-blue-400" />
              <span>Đổi máy</span>
            </button>
          )}
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
            <span className="kpi-label">SẢN LƯỢNG</span>
            <span className="kpi-value">{metrics.quantity}</span>
          </div>
          <div className="kpi-mini-box">
            <span className="kpi-label">TỐC ĐỘ</span>
            <span className="kpi-value">{metrics.speed}</span>
          </div>
          <div className="kpi-mini-box">
            <span className="kpi-label">TỔ</span>
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
        <button type="button" className="header-icon-btn" title="Ứng dụng liên kết">
          <LayoutGrid size={16} />
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
