import { ProcurementRequest, DocStatus, ProcurementItem } from '../types';

// Initial Mock Data
let requests: ProcurementRequest[] = [
  {
    id: '1',
    sppNumber: 'SPP-001',
    requestDate: new Date().toISOString(),
    requesterId: 'PEG-001',
    items: [
      { id: 'i1', name: 'Kertas A4', qty: 50, estimatedPrice: 45000 },
      { id: 'i2', name: 'Tinta Printer Hitam', qty: 10, estimatedPrice: 120000 }
    ],
    status: DocStatus.SPP_CREATED,
  },
  {
    id: '2',
    sppNumber: 'SPP-002',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    requesterId: 'PEG-001',
    items: [
      { id: 'i3', name: 'Laptop Admin', qty: 2, estimatedPrice: 8000000 }
    ],
    status: DocStatus.VERIFIED_BY_PURCHASING,
    sdpNumber: 'SDP-001'
  }
];

export const ProcurementService = {
  getAll: (): ProcurementRequest[] => {
    return [...requests];
  },

  // Logic: Gudang creates SPP
  createSPP: (items: ProcurementItem[]) => {
    const newReq: ProcurementRequest = {
      id: Math.random().toString(36).substr(2, 9),
      sppNumber: `SPP-${requests.length + 1}`.padStart(7, '0'),
      requestDate: new Date().toISOString(),
      requesterId: 'PEG-GUDANG',
      items,
      status: DocStatus.SPP_CREATED
    };
    requests = [newReq, ...requests];
    return newReq;
  },

  // Logic: Pembelian verifies SPP -> create SDP Draft
  verifySPP: (id: string, supplier: string) => {
    requests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: DocStatus.VERIFIED_BY_PURCHASING,
          sdpNumber: `SDP-${Math.floor(Math.random() * 1000)}`,
          supplierName: supplier
        };
      }
      return req;
    });
  },

  // Logic: Pimpinan ACC?
  processApproval: (id: string, approved: boolean, note: string) => {
    requests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: approved ? DocStatus.APPROVED : DocStatus.REJECTED,
          approvalDate: new Date().toISOString(),
          approverId: 'PEG-PIMPINAN',
          approvalNote: note
        };
      }
      return req;
    });
  },

  // Logic: Pembelian creates SOP
  createSOP: (id: string) => {
    requests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: DocStatus.ORDER_PLACED,
          sopNumber: `SOP-${Math.floor(Math.random() * 1000)}`,
          orderDate: new Date().toISOString()
        };
      }
      return req;
    });
  },

  // Logic: Gudang creates LPB (Goods Received)
  receiveGoods: (id: string) => {
    requests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: DocStatus.GOODS_RECEIVED,
          lpbNumber: `LPB-${Math.floor(Math.random() * 1000)}`,
          receivedDate: new Date().toISOString()
        };
      }
      return req;
    });
  },

  // Logic: Keuangan pays
  processPayment: (id: string, amount: number) => {
    requests = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: DocStatus.PAID,
          paymentRef: `TRX-${Math.floor(Math.random() * 10000)}`,
          paymentDate: new Date().toISOString(),
          totalAmount: amount
        };
      }
      return req;
    });
  }
};
