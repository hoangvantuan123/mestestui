import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check } from 'lucide-react';
import './MasterLookup.css';

const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const optionName = option => option.name.startsWith(`${option.code}:`) ? option.name.slice(option.code.length + 1).trim() : option.name;

// ERP-style lookup: persisted value stays unchanged; typing only filters options.
export default function MasterLookup({ options, value, onChange, label }) {
  const id = useId(), input = useRef(null), root = useRef(null), panel = useRef(null);
  const [open, setOpen] = useState(false), [query, setQuery] = useState(''), [active, setActive] = useState(0);
  const [position, setPosition] = useState(null);
  const tokens = normalize(query).trim().split(/\s+/).filter(Boolean);
  const list = options.filter(o => tokens.every(token => normalize(`${o.code} ${o.name}`).includes(token)));
  const begin = () => { setQuery(''); setActive(Math.max(0, options.findIndex(o => o.name === value))); setOpen(true); };
  const select = option => { onChange(option.name); setOpen(false); setQuery(''); input.current.focus(); };
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = root.current.getBoundingClientRect();
      const width = Math.min(Math.max(rect.width, 480), window.innerWidth - 24);
      const below = window.innerHeight - rect.bottom - 12, above = rect.top - 12;
      const flip = below < 230 && above > below;
      const height = Math.min(330, Math.max(100, flip ? above : below));
      setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width, maxHeight: height, ...(flip ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }) });
    };
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!root.current?.contains(event.target) && !panel.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => { if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active, open, id]);
  const keydown = e => {
    if (e.key === 'F10') { e.preventDefault(); begin(); }
    else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!open) begin(); else setActive(i => Math.max(0, Math.min(list.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))); }
    else if (e.key === 'Enter' && open) { e.preventDefault(); if (list[active]) select(list[active]); }
    else if (e.key === 'Tab') setOpen(false);
  };
  return (
    <div className="master-lookup" ref={root}>
      <input ref={input} aria-label={label} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open && list[active] ? `${id}-${active}` : undefined} autoComplete="off" value={open ? query : value || ''} title={value || ''} placeholder="Gõ mã hoặc tên để tìm..." onFocus={begin} onChange={e => { setQuery(e.target.value); setActive(0); setOpen(true); }} onKeyDown={keydown} onBlur={e => { if (!panel.current?.contains(e.relatedTarget) && !root.current?.contains(e.relatedTarget)) setOpen(false); }} />
      <button type="button" tabIndex={-1} aria-label={`Mở danh mục ${label}`} onMouseDown={e => e.preventDefault()} onClick={() => { if (open) setOpen(false); else { input.current.focus(); begin(); } }}><ChevronDown size={14} /></button>
      {open && position && createPortal(
        <div className="master-lookup-panel" ref={panel} style={position} onMouseDown={e => e.preventDefault()}>
          <div className="master-lookup-help"><Search size={13} /><span>Gõ mã hoặc tên để lọc · ↑↓ chọn · Enter xác nhận</span><span>{list.length}/{options.length}</span></div>
          <div className="master-lookup-columns"><span>Mã</span><span>Tên {label.toLowerCase()}</span></div>
          <div className="master-lookup-list" id={`${id}-list`} role="listbox" aria-label={`Danh mục ${label}`}>
            {list.map((o, index) => <div role="option" id={`${id}-${index}`} aria-selected={o.name === value} key={o.code} className={`master-lookup-option ${active === index ? 'is-active' : ''}`} onMouseEnter={() => setActive(index)} onClick={() => select(o)}><span className="master-lookup-code">{o.code}</span><span className="master-lookup-name">{optionName(o)}{o.name === value && <Check size={13} />}</span></div>)}
            {!list.length && <div className="master-lookup-empty">Không tìm thấy mã hoặc tên phù hợp.</div>}
          </div>
        </div>, document.body
      )}
    </div>
  );
}
