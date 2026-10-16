import React from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';

export default function SubHeaderFilter({
  activeTab = 'running',
  onTabChange,
  runningCount = 80,
  completedCount = 2,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onSearchSubmit,
}) {
  return (
    <div className="sub-header-filter-bar">
      {/* Left Tabs */}
      <div className="filter-tabs">
        <button
          type="button"
          className={`tab-item ${activeTab === 'running' ? 'active' : ''}`}
          onClick={() => onTabChange('running')}
        >
          Lệnh chạy ({runningCount})
        </button>
        <button
          type="button"
          className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => onTabChange('completed')}
        >
          Lệnh hoàn thành ({completedCount})
        </button>
      </div>

      {/* Right Search & Filters */}
      <div className="filter-controls">
        {/* Search input with combined Yellow Button */}
        <div className="search-group">
          <input
            type="text"
            className="filter-search-input"
            placeholder="Tìm: Lệnh công đoạn / Số lệnh thao tác / Thao tác..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit && onSearchSubmit()}
          />
          <button
            type="button"
            className="search-btn-yellow"
            onClick={onSearchSubmit}
            title="Tìm kiếm"
          >
            <Search size={14} className="mr-1" />
            <span>Tìm</span>
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">Trạng thái</option>
            <option value="Chờ">Chờ</option>
            <option value="Đang chạy">Đang chạy</option>
            <option value="Tạm dừng">Tạm dừng</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
          <ChevronDown size={14} className="select-chevron" />
        </div>

        {/* Date Range: Bắt đầu (LTT): Từ ngày - Đến ngày */}
        <div className="date-range-group">
          <span className="date-range-label">Bắt đầu (LTT):</span>
          <div className="date-input-wrap">
            <input
              type="text"
              placeholder="Từ ngày"
              className="filter-date-input"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text';
              }}
            />
            <Calendar size={13} className="date-calendar-icon" />
          </div>
          <span className="date-range-sep">—</span>
          <div className="date-input-wrap">
            <input
              type="text"
              placeholder="Đến ngày"
              className="filter-date-input"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text';
              }}
            />
            <Calendar size={13} className="date-calendar-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
