// src/pages/PengaturanPage.jsx
import React from "react";
import GolonganSection from "../components/pengaturan/GolonganSection";
import JabatanSection from "../components/pengaturan/JabatanSection";
import UnitKerjaSection from "../components/pengaturan/UnitKerjaSection";

const PengaturanPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Pengaturan</h1>

      <div className="space-y-8">
        <GolonganSection />
        <JabatanSection />
        <UnitKerjaSection />
      </div>
    </div>
  );
};

export default PengaturanPage;
