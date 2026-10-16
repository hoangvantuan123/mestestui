// Centralized BOM (Bill of Materials) data for MES Rework Station
// Defines all child NVL items for each rework product order

export const PRODUCT_BOM_MAP = {
  // 1. WIS-BSB-00005 (Dùng 6 mã NVL theo đúng quy chuẩn)
  'WIS-BSB-00005': [
    { itemCode: 'LIK-HC2-00213', itemName: 'GH69-43168A', unit: 'Pcs', stockQty: 1246 },
    { itemCode: 'LIK-HC2-00214', itemName: 'GH69-43169A', unit: 'Pcs', stockQty: 980 },
    { itemCode: 'LIK-HC2-00215', itemName: 'SM-X306-Support Pad-TA', unit: 'Pcs', stockQty: 1520 },
    { itemCode: 'LIK-HC2-00219', itemName: 'GH69-43166A', unit: 'Pcs', stockQty: 2100 },
    { itemCode: 'LIK-HC2-00220', itemName: 'GH69-43164A', unit: 'Pcs', stockQty: 890 },
    { itemCode: 'LIK-HC2-00222', itemName: 'SM-X306-TA-Đáy', unit: 'Pcs', stockQty: 1450 },
  ],

  // 2. SSA-HC2-00462 (Dùng bộ 6 mã NVL theo đúng quy chuẩn)
  'SSA-HC2-00462': [
    { itemCode: 'LIK-HC2-00213', itemName: 'GH69-43168A', unit: 'Pcs', stockQty: 1246 },
    { itemCode: 'LIK-HC2-00214', itemName: 'GH69-43169A', unit: 'Pcs', stockQty: 980 },
    { itemCode: 'LIK-HC2-00215', itemName: 'SM-X306-Support Pad-TA', unit: 'Pcs', stockQty: 1520 },
    { itemCode: 'LIK-HC2-00219', itemName: 'GH69-43166A', unit: 'Pcs', stockQty: 2100 },
    { itemCode: 'LIK-HC2-00220', itemName: 'GH69-43164A', unit: 'Pcs', stockQty: 890 },
    { itemCode: 'LIK-HC2-00222', itemName: 'SM-X306-TA-Đáy', unit: 'Pcs', stockQty: 1450 },
  ],

  // 3. WIS-BSB-00002 (Áp dụng bộ 6 NVL)
  'WIS-BSB-00002': [
    { itemCode: 'LIK-HC2-00213', itemName: 'GH69-43168A', unit: 'Pcs', stockQty: 1246 },
    { itemCode: 'LIK-HC2-00214', itemName: 'GH69-43169A', unit: 'Pcs', stockQty: 980 },
    { itemCode: 'LIK-HC2-00215', itemName: 'SM-X306-Support Pad-TA', unit: 'Pcs', stockQty: 1520 },
    { itemCode: 'LIK-HC2-00219', itemName: 'GH69-43166A', unit: 'Pcs', stockQty: 2100 },
    { itemCode: 'LIK-HC2-00220', itemName: 'GH69-43164A', unit: 'Pcs', stockQty: 890 },
    { itemCode: 'LIK-HC2-00222', itemName: 'SM-X306-TA-Đáy', unit: 'Pcs', stockQty: 1450 },
  ],

  // 4. SSA-HMG-00011 (GH69-44322D)
  'SSA-HMG-00011': [
    { itemCode: 'LIK-HMG-00101', itemName: 'GH69-44322D-MAIN FRAME', unit: 'Pcs', stockQty: 2500 },
    { itemCode: 'LIK-HMG-00102', itemName: 'GH69-44322D-BRACKET TOP', unit: 'Pcs', stockQty: 1800 },
    { itemCode: 'LIK-HMG-00103', itemName: 'GH69-44322D-RUBBER PAD', unit: 'Pcs', stockQty: 3200 },
    { itemCode: 'LIK-HMG-00104', itemName: 'GH69-44322D-TAPE SHIELD', unit: 'Pcs', stockQty: 1400 },
  ],

  // 5. SSA-HMM-00089 (GH69-46560A)
  'SSA-HMM-00089': [
    { itemCode: 'LIK-HMM-00201', itemName: 'GH69-46560A-SUB FRAME 76', unit: 'Pcs', stockQty: 3500 },
    { itemCode: 'LIK-HMM-00202', itemName: 'GH69-46560A-LABEL CHANGE 75-76', unit: 'Pcs', stockQty: 9000 },
    { itemCode: 'LIK-HMM-00203', itemName: 'GH69-46560A-CUSHION FOAM', unit: 'Pcs', stockQty: 4200 },
  ],

  // 6. CAN-FSA-00075 (RX1-3079-000)
  'CAN-FSA-00075': [
    { itemCode: 'LIK-FSA-00301', itemName: 'RX1-3079-PHÔI HỘP GẬP', unit: 'Pcs', stockQty: 1500 },
    { itemCode: 'LIK-FSA-00302', itemName: 'RX1-3079-TEM MÃ XUẤT KHẨU', unit: 'Pcs', stockQty: 6000 },
  ],
};

/**
 * Lấy danh sách NVL BOM cho bất kỳ mã thành phẩm/bán thành phẩm nào
 */
export function getOrderBOM(productCode) {
  if (productCode && PRODUCT_BOM_MAP[productCode]) {
    return PRODUCT_BOM_MAP[productCode];
  }
  // Mặc định trả về bộ BOM 6 mã theo yêu cầu
  return PRODUCT_BOM_MAP['WIS-BSB-00005'];
}
