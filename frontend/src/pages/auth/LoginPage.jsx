// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authService";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/images/pbd.jpg";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"; // Menggunakan ikon dari Lucide

// Daftar gambar background (Logika Anda)
const backgroundImages = [
  "/images/1.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/2.jpg",
];

const LoginPage = () => {
  // --- SEMUA LOGIKA STATE DAN FUNGSI ANDA TETAP SAMA ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Ganti gambar setiap 5 detik
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(username, password);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // --- DESAIN LAYOUT BARU DIMULAI DI SINI ---
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* --- Kolom Kiri: Area Branding & Visual --- */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 text-center text-white bg-gray-900">
        {/* Slideshow Gambar Background */}
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-indigo-900/50"></div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src={Logo}
            alt="Logo Bapperida"
            className="w-24 h-auto mx-auto mb-6 rounded-lg shadow-lg"
          />
          <h1 className="text-5xl font-bold tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            SIMPEG
          </h1>
          <p className="mt-4 text-lg font-medium max-w-lg text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
            Sistem Informasi Manajemen Kepegawaian
            <br />
            Bapperida Provinsi Papua Barat Daya
          </p>
        </div>
        <div className="absolute bottom-8 text-xs text-gray-400 z-10">
          &copy; {new Date().getFullYear()} Bapperida PBD. All rights reserved.
        </div>
      </div>

      {/* --- Kolom Kanan: Area Form Login --- */}
      <div className="flex items-center justify-center p-6 sm:p-12 w-full bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <img
              src={Logo}
              alt="Logo Bapperida"
              className="w-20 h-auto mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              SIMPEG Bapperida
            </h1>
          </div>
          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-500 mt-2">
              Masuk untuk mengelola data pegawai, SKP, KP, dan KGB.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-center text-sm font-medium text-red-800 bg-red-100 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  NIP / Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg transition-all bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan NIP atau username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 rounded-lg transition-all bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 rounded-lg font-semibold transition-all bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
