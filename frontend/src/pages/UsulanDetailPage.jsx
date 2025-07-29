/* eslint-disable no-unused-vars */
// src/pages/UsulanDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUsulanById, updateStatusUsulan } from '../api/usulanService';
import { useAuth } from '../contexts/AuthContext';
// --- PERBAIKAN DI SINI: Tambahkan 'FileText' ke dalam import ---
import { Loader2, ArrowLeft, User, Briefcase, Building, Calendar, FileText } from 'lucide-react';

// Komponen kecil untuk menampilkan item detail
const DetailItem = ({ icon, label, value }) => (
  <div>
    <p className="text-sm font-medium text-slate-500 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </p>
    <p className="text-lg text-slate-800 font-semibold pl-8">{value || '-'}</p>
  </div>
);

const UsulanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [usulan, setUsulan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUsulanById(id);
        setUsulan(data);
      } catch (error) {
        console.error("Gagal memuat detail usulan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleVerification = async (newStatus) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        status_usulan: newStatus,
        catatan_verifikator: catatan,
        diverifikasi_oleh: user.id,
      };
      await updateStatusUsulan(id, dataToUpdate);
      alert(`Usulan telah berhasil diubah menjadi: ${newStatus}`);
      navigate('/usulan');
    } catch (error) {
      alert('Gagal memperbarui status usulan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" size={32} /></div>;
  }

  if (!usulan) {
    return <div className="text-center p-8">Data usulan tidak ditemukan.</div>;
  }

  return (
    <div>
      <Link to="/usulan" className="inline-flex items-center text-indigo-600 hover:underline mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2" />
        Kembali ke Daftar Usulan
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Detail Usulan #{usulan.id}</h1>
          <p className="text-slate-500 mt-1">
            Usulan {usulan.jenis_usulan} untuk pegawai a.n. <span className="font-semibold">{usulan.Pegawai.nama_lengkap}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-700 border-b pb-2 mb-4">Informasi Pegawai</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={<User size={18} />} label="Nama Lengkap" value={usulan.Pegawai.nama_lengkap} />
                <DetailItem icon={<User size={18} />} label="NIP" value={usulan.Pegawai.nip} />
                <DetailItem icon={<Briefcase size={18} />} label="Jabatan Saat Ini" value={usulan.Pegawai.Jabatan?.nama_jabatan} />
                <DetailItem icon={<Briefcase size={18} />} label="Golongan Saat Ini" value={`${usulan.Pegawai.Golongan?.golongan_ruang} - ${usulan.Pegawai.Golongan?.nama_pangkat}`} />
                <DetailItem icon={<Building size={18} />} label="Unit Kerja" value={usulan.Pegawai.UnitKerja?.nama_unit_kerja} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-700 border-b pb-2 mb-4">Informasi Usulan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={<FileText size={18} />} label="Jenis Usulan" value={usulan.jenis_usulan} />
                {usulan.sub_jenis_kp_pilihan && <DetailItem icon={<FileText size={18} />} label="Detail KP Pilihan" value={usulan.sub_jenis_kp_pilihan} />}
                <DetailItem icon={<Calendar size={18} />} label="Tanggal Diajukan" value={formatDate(usulan.tanggal_usulan)} />
                <DetailItem icon={<Calendar size={18} />} label="Status Saat Ini" value={usulan.status_usulan} />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 p-6 rounded-lg border self-start">
            <h2 className="text-xl font-bold text-slate-700">Aksi Verifikasi</h2>
            <p className="text-sm text-slate-600">Sebagai verifikator, Anda dapat menyetujui atau menolak usulan ini.</p>
            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-slate-700 mb-1">Catatan (Opsional)</label>
              <textarea 
                id="catatan"
                placeholder="Tambahkan catatan jika usulan ditolak..." 
                className="w-full p-2 border rounded-md input-style"
                rows="4"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleVerification('Disetujui')}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Setujui'}
              </button>
              <button 
                onClick={() => handleVerification('Ditolak')}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsulanDetailPage;
