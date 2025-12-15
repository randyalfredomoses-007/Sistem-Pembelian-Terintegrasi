import React from 'react';
import { ProcurementRequest, DocStatus } from '../types';
import { ProcurementService } from '../services/mockDb';
import { StatusBadge } from '../components/StatusBadge';
import { DollarSign, Printer } from 'lucide-react';

interface Props {
  data: ProcurementRequest[];
  refresh: () => void;
}

const Keuangan: React.FC<Props> = ({ data, refresh }) => {
  const pendingPayment = data.filter(r => r.status === DocStatus.GOODS_RECEIVED);

  const handlePay = (id: string, items: any[]) => {
    // Calculate mock total
    const total = items.reduce((acc, curr) => acc + (curr.qty * curr.estimatedPrice), 0);
    if (confirm(`Konfirmasi pembayaran Faktur sebesar Rp ${total.toLocaleString('id-ID')}?`)) {
      ProcurementService.processPayment(id, total);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payable Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Tagihan Belum Dibayar</h2>
           <div className="space-y-3">
             {pendingPayment.length === 0 && <p className="text-slate-400 text-sm">Tidak ada tagihan pending.</p>}
             {pendingPayment.map(req => (
               <div key={req.id} className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                        <div className="font-bold text-slate-800">{req.lpbNumber}</div>
                        <div className="text-xs text-slate-500">Ref SOP: {req.sopNumber}</div>
                        <div className="mt-2 text-sm text-slate-700">
                            Total Estimasi: <span className="font-mono font-bold">
                                Rp {req.items.reduce((acc, i) => acc + (i.qty * i.estimatedPrice), 0).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => handlePay(req.id, req.items)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                        title="Bayar Sekarang"
                    >
                        <DollarSign size={20} />
                    </button>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Paid History */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Riwayat Transaksi (LPT)</h2>
            <div className="overflow-auto max-h-[300px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-3 py-2">Ref Pembayaran</th>
                            <th className="px-3 py-2">Jumlah</th>
                            <th className="px-3 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data.filter(r => r.status === DocStatus.PAID).map(req => (
                            <tr key={req.id}>
                                <td className="px-3 py-2">
                                    <div className="font-medium text-slate-800">{req.paymentRef}</div>
                                    <div className="text-xs text-slate-500">{new Date(req.paymentDate!).toLocaleDateString('id-ID')}</div>
                                </td>
                                <td className="px-3 py-2 font-mono text-slate-700">
                                    Rp {req.totalAmount?.toLocaleString('id-ID')}
                                </td>
                                <td className="px-3 py-2">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Lunas</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Keuangan;
