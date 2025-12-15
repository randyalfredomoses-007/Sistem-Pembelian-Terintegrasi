export enum UserRole {
  GUDANG = 'GUDANG',
  PEMBELIAN = 'PEMBELIAN',
  PIMPINAN = 'PIMPINAN',
  KEUANGAN = 'KEUANGAN',
}

export enum DocStatus {
  SPP_CREATED = 'SPP_DIAJUKAN',      // Created by Gudang
  VERIFIED_BY_PURCHASING = 'SPP_VERIFIKASI', // Reviewed by Pembelian, waiting for Pimpinan
  APPROVED = 'ACC_DISETUJUI',        // Approved by Pimpinan (SDP Valid)
  REJECTED = 'DITOLAK',              // Rejected by Pimpinan
  ORDER_PLACED = 'SOP_DIKIRIM',      // SOP created by Pembelian sent to Supplier
  GOODS_RECEIVED = 'BARANG_DITERIMA', // LPB created by Gudang
  PAID = 'LUNAS',                    // Paid by Keuangan
}

export interface ProcurementItem {
  id: string;
  name: string;
  qty: number;
  estimatedPrice: number;
}

// Represents the unified document flow (SPP -> SDP -> SOP -> LPB -> Transaksi)
export interface ProcurementRequest {
  id: string;
  sppNumber: string;
  requestDate: string;
  requesterId: string; // Gudang Pegawai ID
  items: ProcurementItem[];
  status: DocStatus;
  
  // SDP Phase
  sdpNumber?: string;
  approvalDate?: string;
  approverId?: string; // Pimpinan ID
  approvalNote?: string;

  // SOP Phase
  sopNumber?: string;
  supplierName?: string;
  orderDate?: string;

  // LPB Phase
  lpbNumber?: string;
  receivedDate?: string;
  
  // Finance Phase
  paymentRef?: string;
  paymentDate?: string;
  totalAmount?: number;
}
