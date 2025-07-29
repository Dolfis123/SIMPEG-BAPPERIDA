// src/components/laporan/DukTable.jsx
import React from "react";

const DukTable = ({ data, offset }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-3 font-semibold text-slate-600">No</th>
            <th className="p-3 font-semibold text-slate-600">Nama / NIP</th>
            <th className="p-3 font-semibold text-slate-600">Pangkat / Gol.</th>
            <th className="p-3 font-semibold text-slate-600">Jabatan</th>
            <th className="p-3 font-semibold text-slate-600">TMT Pangkat</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((p, index) => (
              <tr
                key={p.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >
                <td className="p-3">{offset + index + 1}</td>
                <td className="p-3">
                  <p className="font-medium text-slate-800">{p.nama_lengkap}</p>
                  <p className="text-sm text-slate-500">{p.nip}</p>
                </td>
                <td className="p-3">{`${p.Golongan?.nama_pangkat} (${p.Golongan?.golongan_ruang})`}</td>
                <td className="p-3">{p.Jabatan?.nama_jabatan}</td>
                <td className="p-3">{formatDate(p.tmt_pangkat_terakhir)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-8 text-slate-500">
                Tidak ada data untuk ditampilkan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DukTable;
