import React from 'react';
import { ProcurementRequest, DocStatus } from '../types';
import { ProcurementService } from '../services/mockDb';
import { StatusBadge } from '../components/StatusBadge';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  data: ProcurementRequest[];
  refresh: () => void;
}

const Pimpinan: React.FC<Props> = ({ data, refresh }) => {
  const pendingRequests = data.filter(r => r.status === DocStatus.VERIFIED_BY_PURCHASING);

  const handleApprove = (id: string, approve: boolean) => {
    const note = prompt(approve ? "Catatan Persetujuan (Opsional):" : "Alasan Penolakan:");
    if (approve || note) {
       ProcurementService.processApproval(id, approve, note || '');
       refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Persetujuan Dokumen (ACC?)</h2>
        <p className="text-slate-500 mb-6 text-sm">Meninjau Surat Dasar Pembelian (SDP) yang diajukan Bagian Pembelian.</p>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-400">Tidak ada dokumen yang menunggu persetujuan.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 hover:bg-white transition-all">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800">{req.sdpNumber}</span>
                      <span className="text-xs text-slate-500">Ref SPP: {req.sppNumber}</span>
                   </div>
                   <div className="text-sm text-slate-600 mb-2">
                      Supplier Usulan: <strong>{req.supplierName}</strong>
                   </div>
                   <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200 inline-block">
                      {req.items.map((i, idx) => (
                        <div key={idx}>{i.name} (Qty: {i.qty})</div>
                      ))}
                   </div>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button 
                    onClick={() => handleApprove(req.id, false)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium"
                  >
                    <XCircle size={16} /> Tolak
                  </button>
                  <button 
                    onClick={() => handleApprove(req.id, true)}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-medium shadow-sm"
                  >
                    <CheckCircle size={16} /> ACC (Setujui)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-slate-700 mb-4">Riwayat Keputusan</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left">Nomor SDP</th>
                        <th className="px-4 py-3 text-left">Tanggal</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    {data.filter(r => r.status === DocStatus.APPROVED || r.status === DocStatus.REJECTED).map(req => (
                        <tr key={req.id} className="border-b last:border-0">
                            <td className="px-4 py-3 font-medium">{req.sdpNumber}</td>
                            <td className="px-4 py-3 text-slate-500">{new Date(req.approvalDate!).toLocaleDateString('id-ID')}</td>
                            <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                            <td className="px-4 py-3 text-slate-600 italic">"{req.approvalNote}"</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Pimpinan;
