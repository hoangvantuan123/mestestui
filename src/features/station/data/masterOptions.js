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
  if (cat.includes('sort') || cat.includes('phân loại')) return '7A: Sorting - Nội bộ';
  if (cat.includes('xả') || cat.includes('cuộn') || cat.includes('tờ')) {
    return '6: Xả cuộn/Chia cuộn/Chia tờ';
  }
  return '8A: Rework - Nội bộ';
}

// 9. Danh sách Đối tượng (Cho phép chọn/edit)
export const OBJECT_ENTITY_OPTIONS = [
  { code: 'GS1.PXSX.04.01', name: 'GS1.PXSX.04.01: Tổ hoàn thiện Duplex' },
  { code: 'GS5.PX1A.03.04', name: 'GS5.PX1A.03.04: Tổ hoàn thiện hộp' },
  { code: 'GS6.PXSX.03.01.02', name: 'GS6.PXSX.03.01.02: Tổ hoàn thiện khay' },
  { code: 'GS6.PXSX.03.02', name: 'GS6.PXSX.03.02: Tổ hoàn thiện khay' },
  { code: 'GS6.PXSX.03.02.02', name: 'GS6.PXSX.03.02.02: Tổ hoàn thiện khay' },
  { code: 'GS6.PXSX.03', name: 'GS6.PXSX.03: Tổ hoàn thiện khay giấy' },
  { code: 'GS5.PX1A.03.03', name: 'GS5.PX1A.03.03: Tổ hoàn thiện sách' },
  { code: 'GS6.PXSX.01.02', name: 'GS6.PXSX.01.02: Tổ in cuộn' },
  { code: 'GS1.PXSX.03.01', name: 'GS1.PXSX.03.01: Tổ In Flexo' },
  { code: 'GS1.PXSX.02.01', name: 'GS1.PXSX.02.01: Tổ In Offset' },
];

// c. Danh sách Bộ phận (Cho phép chọn/edit)
export const DEPARTMENT_OPTIONS = [
  { code: 'GS5.PX1B.01.02.02', name: 'GS5.PX1B.01.02.02: Nhóm TTSX - Tổ Bồi/Bế 1B' },
  { code: 'GS5.PX1A.02.03.02', name: 'GS5.PX1A.02.03.02: Nhóm TTSX - Tổ dán' },
  { code: 'GS5.PX1A.02.04.02', name: 'GS5.PX1A.02.04.02: Nhóm TTSX - Tổ Gift' },
  { code: 'GS5.PX1B.01.03.02', name: 'GS5.PX1B.01.03.02: Nhóm TTSX - Tổ hoàn thiện 1B' },
  { code: 'GS5.PX1A.04.02.02', name: 'GS5.PX1A.04.02.02: Nhóm TTSX - Tổ hoàn thiện hộp' },
  { code: 'GS6.PXSX.03.02.02', name: 'GS6.PXSX.03.02.02: Nhóm TTSX - Tổ hoàn thiện Khay' },
  { code: 'GS5.PX1A.03.03.02', name: 'GS5.PX1A.03.03.02: Nhóm TTSX - Tổ hoàn thiện sách' },
  { code: 'GS1.PXSX.04.01.02', name: 'GS1.PXSX.04.01.02: Nhóm TTSX - Tổ HT Carton GSHN' },
  { code: 'GS1.PXSX.05.01.02', name: 'GS1.PXSX.05.01.02: Nhóm TTSX - Tổ HT Duplex GSHN' },
  { code: 'GS6.PXSX.01.02.02', name: 'GS6.PXSX.01.02.02: Nhóm TTSX - Tổ in cuộn GSQV2' },
  { code: 'GS5.PKHO.01.03.03', name: 'GS5.PKHO.01.03.03: Nhóm Kho CCDC và vật tư cơ điện' },
  { code: 'GS5.PKHO.01.01.01', name: 'GS5.PKHO.01.01.01: Nhóm Kho DO' },
  { code: 'GS5.PKHO.01.03.01', name: 'GS5.PKHO.01.03.01: Nhóm Kho Giấy (Giấy cuộn, Giấy tờ)' },
  { code: 'GS5.PKHO.01.04.04', name: 'GS5.PKHO.01.04.04: Nhóm Kho Lẻ' },
  { code: 'GS5.PKHO.01.04.03', name: 'GS5.PKHO.01.04.03: Nhóm Kho LIK (Bồi/Bế/LIK...)' },
  { code: 'GS5.PKHO.01.04.02', name: 'GS5.PKHO.01.04.02: Nhóm Kho Phôi sóng' },
  { code: 'GS5.PKHO.01.02.01', name: 'GS5.PKHO.01.02.01: Nhóm Kho Thành phẩm' },
  { code: 'GS5.PKHO.01.04.01', name: 'GS5.PKHO.01.04.01: Nhóm Kho Tờ in' },
  { code: 'GS5.PKHO.01.03.02', name: 'GS5.PKHO.01.03.02: Nhóm Kho Vật tư phụ' },
  { code: 'GS5.PX1A.05.01.01', name: 'GS5.PX1A.05.01.01: Nhóm khuôn mẫu, bản' },
  { code: 'GS5.CNTB.01.01.03', name: 'GS5.CNTB.01.01.03: Nhóm kỹ thuật phân xưởng GS Quế võ' },
];

// d. Danh sách Mã kho phân xưởng (Cho phép edit, mặc định lấy từ kho nhập NVL)
export const WORKSHOP_WAREHOUSE_OPTIONS = [
  { code: 'GS5-PXU-05', name: 'GS5-PXU-05: Kho TD PX 1B - QV1' },
  { code: 'GS1-PXU-03', name: 'GS1-PXU-03: Kho TD PX Carton - GSHN' },
  { code: 'GS1-PXU-04', name: 'GS1-PXU-04: Kho TD PX Duplex - GSHN' },
  { code: 'GS5-PXU-03', name: 'GS5-PXU-03: Kho TD PX HT Hộp - QV1' },
  { code: 'GS1-PXU-05', name: 'GS1-PXU-05: Kho TD PX in Flexo - GSHN' },
  { code: 'GS6-PXU-01', name: 'GS6-PXU-01: Kho TD PX In Flexo - QV2' },
  { code: 'GS1-PXU-01', name: 'GS1-PXU-01: Kho TD PX In offset - GSHN' },
  { code: 'GS5-PXU-01', name: 'GS5-PXU-01: Kho TD PX In Offset - QV1' },
  { code: 'GS6-PXU-03', name: 'GS6-PXU-03: Kho TD PX khay - QV2' },
  { code: 'GS5-PXU-02', name: 'GS5-PXU-02: Kho TD PX LIK Hộp - QV1' },
];

// Kho xuất nguồn cấp khi lấy NVL
export const EXPORT_WAREHOUSE_OPTIONS = [
  { code: 'GS5-TPH-01', name: 'GS5-TPH-01 (Kho TPH 01)' },
  { code: 'GS5-TPH-02', name: 'GS5-TPH-02 (Kho TPH 02)' },
  { code: 'KHO-TONG', name: 'KHO-TONG (Kho Tổng)' },
  { code: 'GS5-PXU-05', name: 'GS5-PXU-05 (Kho Phân Xưởng)' },
];

// Danh mục nhà máy theo dữ liệu cung cấp.
export const FACTORY_OPTIONS = [
  { code: 'G61', name: 'G61: Nhà máy GS Quế Võ 2- PX Túi' },
  { code: 'G62', name: 'G62: Nhà máy GS Quế Võ 2- PX Khay' },
  { code: 'GS0', name: 'GS0: Công ty GSP' },
  { code: 'GS1', name: 'GS1: Nhà máy GS Hà Nội' },
  { code: 'GS5', name: 'GS5: Nhà máy GS Quế Võ 1' },
  { code: 'GS6', name: 'GS6: Nhà máy GS Quế Võ 2' },
];
