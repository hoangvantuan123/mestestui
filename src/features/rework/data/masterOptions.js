// Master options for MES Station Modals (MaterialModal, CompleteOrderModal, etc.)

// 7. Phân loại theo đúng Master dữ liệu ERP/MES
export const CLASSIFICATION_OPTIONS = [
  { code: '6', name: '6: Xả cuộn/Chia cuộn/Chia tờ' },
  { code: '7A', name: '7A: Sorting - Nội bộ' },
  { code: '7B', name: '7B: Sorting - Hàng bán bị trả lại (RMA)' },
  { code: '8A', name: '8A: Rework - Nội bộ' },
  { code: '8B', name: '8B: Rework - Hàng bán bị trả lại (RMA)' },
];

export function resolveClassification(category = '') {
  const cat = String(category).toLowerCase();
  if (cat.includes('rma') || cat.includes('trả lại') || cat.includes('tra lai')) {
    if (cat.includes('sort')) return '7B: Sorting - Hàng bán bị trả lại (RMA)';
    return '8B: Rework - Hàng bán bị trả lại (RMA)';
  }
  if (cat.includes('sort')) return '7A: Sorting - Nội bộ';
  if (cat.includes('xả') || cat.includes('cuộn') || cat.includes('tờ')) {
    return '6: Xả cuộn/Chia cuộn/Chia tờ';
  }
  return '8A: Rework - Nội bộ';
}

// 9. Danh sách Đối tượng (Cho phép chọn/edit)
export const OBJECT_ENTITY_OPTIONS = [
  { code: 'GS5', name: 'GS5: Nhà máy Goldsun Quế Võ 5' },
  { code: 'GS1', name: 'GS1: Nhà máy Goldsun Quế Võ 1' },
  { code: 'GS3', name: 'GS3: Nhà máy Goldsun Quế Võ 3' },
  { code: 'SSVN', name: 'SSVN: Samsung Electronics Việt Nam' },
  { code: 'SHIN', name: 'SHIN: Khách hàng Shinwoo Tech' },
  { code: 'FOX', name: 'FOX: Tập đoàn Foxconn Quế Võ' },
];

// c. Danh sách Bộ phận (Cho phép chọn/edit)
export const DEPARTMENT_OPTIONS = [
  { code: 'PX-RW01', name: 'PX-RW01: Phân xưởng Rework / Sorting G01' },
  { code: 'PX-IN', name: 'PX-IN: Phân xưởng In offset & Flexo' },
  { code: 'PX-CAT', name: 'PX-CAT: Phân xưởng Cắt chia cuộn / Chia tờ' },
  { code: 'PX-DAN', name: 'PX-DAN: Phân xưởng Dán hộp & Đóng gói' },
  { code: 'QC-KCS', name: 'QC-KCS: Bộ phận Quản lý Chất lượng (QC/QA)' },
  { code: 'KHO-LOG', name: 'KHO-LOG: Bộ phận Kho vận & Logistics' },
];

// d. Danh sách Mã kho phân xưởng (Cho phép edit, mặc định lấy từ kho nhập NVL)
export const WORKSHOP_WAREHOUSE_OPTIONS = [
  { code: 'GS5-PXU-05: Kho TD PX 1B - QV1', name: 'GS5-PXU-05: Kho TD PX 1B - QV1 (Trạm Rework)' },
  { code: 'GS5-PXU-01: Kho Phân Xưởng 1', name: 'GS5-PXU-01: Kho Phân Xưởng 1' },
  { code: 'GS5-PXU-REWORK: Kho Đệm Rework - QV1', name: 'GS5-PXU-REWORK: Kho Đệm Rework - QV1' },
  { code: 'GS5-TPH-01: Kho Thành Phẩm 01', name: 'GS5-TPH-01: Kho Thành Phẩm 01' },
  { code: 'GS5-TPH-02: Kho Thành Phẩm 02', name: 'GS5-TPH-02: Kho Thành Phẩm 02' },
];

// Kho xuất nguồn cấp khi lấy NVL
export const EXPORT_WAREHOUSE_OPTIONS = [
  { code: 'GS5-TPH-01', name: 'GS5-TPH-01 (Kho TPH 01)' },
  { code: 'GS5-TPH-02', name: 'GS5-TPH-02 (Kho TPH 02)' },
  { code: 'KHO-TONG', name: 'KHO-TONG (Kho Tổng)' },
  { code: 'GS5-PXU-05', name: 'GS5-PXU-05 (Kho Phân Xưởng)' },
];
