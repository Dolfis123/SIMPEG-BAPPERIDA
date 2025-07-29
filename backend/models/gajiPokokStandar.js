// backend/models/gajiPokokStandar.js
module.exports = (sequelize, DataTypes) => {
  const GajiPokokStandar = sequelize.define('GajiPokokStandar', {
    id_gaji_standar: { // Primary Key: Unique ID for each standard salary entry
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_golongan: { // Foreign Key to Golongan (golongan_master)
      type: DataTypes.INTEGER,
      allowNull: false
    },
    masa_kerja_tahun: { // Group Working Period (MKG) in years
      type: DataTypes.INTEGER,
      allowNull: false
    },
    besaran_gaji_pokok: { // Basic salary amount for a specific group and MKG
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
  }, {
    tableName: 'gaji_pokok_standar', // Name of the table in the database
    timestamps: false // Master data does not need createdAt, updatedAt
  });
  return GajiPokokStandar;
};