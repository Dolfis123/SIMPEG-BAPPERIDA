// backend/models/index.js
const sequelize = require('../config/database');
const Golongan = require('./Golongan');
const Jabatan = require('./Jabatan');
const UnitKerja = require('./UnitKerja');
const Pegawai = require('./Pegawai');
const Dokumen = require('./Dokumen');
const KinerjaSKP = require('./KinerjaSKP');
const User = require('./User');
const UsulanKpKgb = require('./UsulanKpKgb');
const RiwayatPangkat = require('./RiwayatPangkat');
// --- Impor Model Baru untuk DUK ---
const RiwayatPendidikan = require('./RiwayatPendidikan');
const RiwayatDiklat = require('./RiwayatDiklat');

const db = {};

db.sequelize = sequelize;

// --- 1. Daftarkan semua model Anda secara manual ---
db.Golongan = Golongan;
db.Jabatan = Jabatan;
db.UnitKerja = UnitKerja;
db.Pegawai = Pegawai;
db.Dokumen = Dokumen;
db.KinerjaSKP = KinerjaSKP;
db.UsulanKpKgb = UsulanKpKgb;
db.RiwayatPangkat = RiwayatPangkat;
db.User = User;
db.RiwayatPendidikan = RiwayatPendidikan;
db.RiwayatDiklat = RiwayatDiklat;

// --- 2. Definisikan semua hubungan (associations) di sini ---

// Hubungan Pegawai dengan data master
db.Pegawai.belongsTo(db.Golongan, { foreignKey: 'id_golongan', as: 'Golongan' });
db.Pegawai.belongsTo(db.Jabatan, { foreignKey: 'id_jabatan', as: 'Jabatan' });
db.Pegawai.belongsTo(db.UnitKerja, { foreignKey: 'id_unit_kerja', as: 'UnitKerja' });

// Hubungan Pegawai dengan data transaksional
db.Pegawai.hasMany(db.Dokumen, { foreignKey: 'pegawai_id', as: 'dokumen' });
db.Dokumen.belongsTo(db.Pegawai, { foreignKey: 'pegawai_id' });

db.Pegawai.hasMany(db.KinerjaSKP, { foreignKey: 'pegawai_id', as: 'kinerja' });
db.KinerjaSKP.belongsTo(db.Pegawai, { foreignKey: 'pegawai_id' });

db.Pegawai.hasMany(db.UsulanKpKgb, { foreignKey: 'pegawai_id', as: 'usulan' });
db.UsulanKpKgb.belongsTo(db.Pegawai, { foreignKey: 'pegawai_id' });

// Hubungan Usulan dengan User
db.UsulanKpKgb.belongsTo(db.User, { foreignKey: 'diajukan_oleh', as: 'pembuat' });
db.UsulanKpKgb.belongsTo(db.User, { foreignKey: 'diverifikasi_oleh', as: 'verifikator' });

// Hubungan Riwayat Pangkat
db.Pegawai.hasMany(db.RiwayatPangkat, { foreignKey: 'pegawai_id', as: 'riwayatPangkat' });
db.RiwayatPangkat.belongsTo(db.Pegawai, { foreignKey: 'pegawai_id' });
db.RiwayatPangkat.belongsTo(db.Golongan, { foreignKey: 'id_golongan' });

// --- Hubungan Baru untuk DUK ---
db.Pegawai.hasMany(db.RiwayatPendidikan, { foreignKey: 'pegawai_id', as: 'RiwayatPendidikan' });
db.RiwayatPendidikan.belongsTo(db.Pegawai, { foreignKey: 'pegawai_id' });

db.Pegawai.hasMany(db.RiwayatDiklat, { foreignKey: 'pegawai_id', as: 'RiwayatDiklat' });
db.RiwayatDiklat.belongsTo(db.Pegawai, { foreignKey: 'pegawai_id' });


module.exports = db;