import React from 'react';
import { DocStatus } from '../types';

export const StatusBadge: React.FC<{ status: DocStatus }> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case DocStatus.SPP_CREATED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case DocStatus.VERIFIED_BY_PURCHASING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case DocStatus.APPROVED: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case DocStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      case DocStatus.ORDER_PLACED: return 'bg-amber-100 text-amber-800 border-amber-200';
      case DocStatus.GOODS_RECEIVED: return 'bg-teal-100 text-teal-800 border-teal-200';
      case DocStatus.PAID: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = () => {
    switch (status) {
      case DocStatus.SPP_CREATED: return 'Menunggu Verifikasi';
      case DocStatus.VERIFIED_BY_PURCHASING: return 'Menunggu ACC Pimpinan';
      case DocStatus.APPROVED: return 'ACC - Siap Order';
      case DocStatus.REJECTED: return 'Ditolak';
      case DocStatus.ORDER_PLACED: return 'Order ke Supplier';
      case DocStatus.GOODS_RECEIVED: return 'Barang Diterima';
      case DocStatus.PAID: return 'Lunas / Selesai';
      default: return status;
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle()}`}>
      {getLabel()}
    </span>
  );
};