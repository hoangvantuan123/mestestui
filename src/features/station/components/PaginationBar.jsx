import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function PaginationBar({
  totalCount = 80,
  currentPage = 1,
  pageSize = 50,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="mes-pagination-bar">
      {/* Left: Total orders count */}
      <div className="pagination-count">
        <span className="font-semibold text-slate-700">{totalCount}</span> lệnh thao tác
      </div>

      {/* Center: Page numbers */}
      <div className="pagination-controls">
        <button
          type="button"
          className="page-nav-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        <button
          type="button"
          className="page-nav-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Trang sau"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Right: Items per page selector */}
      <div className="pagination-size">
        <div className="size-select-wrap">
          <select
            className="size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>
          <ChevronDown size={14} className="size-select-chevron" />
        </div>
      </div>
    </div>
  );
}
