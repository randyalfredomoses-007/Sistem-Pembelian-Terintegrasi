import React, { useState } from 'react';
import { ProcurementRequest, DocStatus } from '../types';
import { ProcurementService } from '../services/mockDb';
import { StatusBadge } from '../components/StatusBadge';
import { Plus, PackageCheck } from 'lucide-react';

interface Props {
  data: ProcurementRequest[];
  refresh: () => void;
}

const Gudang: React.FC<Props> = ({ data, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([{ name: '', qty: 1, estimatedPrice: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: 1, estimatedPrice: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(i => i.name.trim() !== '' && i.qty > 0);
    if (validItems.length === 0) return;

    const mappedItems = validItems.map(i => ({
      ...i,
      id: Math.random().toString(36).substr(2, 5)
    }));

    ProcurementService.createSPP(mappedItems);
    setShowForm(false);
    setItems([{ name: '', qty: 1, estimatedPrice: 0 }]);
    refresh();
  };

  const handleReceive = (id: string) => {
    if(confirm("Konfirmasi penerimaan barang sesuai SOP?")) {
      ProcurementService.receiveGoods(id);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Buat Surat Permintaan Pembelian (SPP)</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Buat SPP Baru
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold mb-3 uppercase text-slate-500">Formulir Barang</h3>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 mb-3">
                <input 
                  placeholder="Nama Barang"
                  className="flex-1 p-2 border rounded-md text-sm"
                  value={item.name}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[idx].name = e.target.value;
                    setItems(newItems);
                  }}
                  required
                />
                <input 
                  type="number"
                  placeholder="Qty"
                  className="w-20 p-2 border rounded-md text-sm"
                  value={item.qty}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[idx].qty = parseInt(e.target.value);
                    setItems(newItems);
                  }}
                  min="1"
                />
                <input 
                  type="number"
                  placeholder="Estimasi Harga"
                  className="w-32 p-2 border rounded-md text-sm"
                  value={item.estimatedPrice}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[idx].estimatedPrice = parseInt(e.target.value);
                    setItems(newItems);
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={handleAddItem} className="text-blue-600 text-sm hover:underline">+ Tambah Baris</button>
              <div className="flex-1"></div>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Ajukan SPP</button>
            </div>
          </form>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nomor SPP</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{req.sppNumber}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(req.requestDate).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-slate-600">
                  {req.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-6 py-4">
                  {req.status === DocStatus.ORDER_PLACED && (
                    <button 
                      onClick={() => handleReceive(req.id)}
                      className="text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                    >
                      <PackageCheck size={16} /> Terima Barang (LPB)
                    </button>
                  )}
                  {req.status === DocStatus.GOODS_RECEIVED && (
                    <span className="text-xs text-slate-400">Menunggu Pembayaran</span>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Belum ada data pengajuan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gudang;
