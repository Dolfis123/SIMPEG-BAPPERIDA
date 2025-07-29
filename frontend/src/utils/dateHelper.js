// src/utils/dateHelper.js
import { addYears, differenceInMonths, format, isPast } from 'date-fns';
import { id } from 'date-fns/locale';

const formatTanggalLengkap = (date) => {
    return format(date, 'd MMMM yyyy', { locale: id });
};

const getStatusText = (targetDate, today) => {
    if (isPast(targetDate)) return "Sudah Lewat";
    const selisihBulan = differenceInMonths(targetDate, today);
    if (selisihBulan <= 3) return "Segera";
    if (selisihBulan <= 12) return `${selisihBulan} bulan lagi`;
    const selisihTahun = Math.floor(selisihBulan / 12);
    const sisaBulan = selisihBulan % 12;
    if (sisaBulan === 0) return `${selisihTahun} tahun lagi`;
    return `${selisihTahun} tahun ${sisaBulan} bulan lagi`;
};

export const hitungJadwalKP = (tmtPangkatTerakhir) => {
    if (!tmtPangkatTerakhir) return { status: '-', tanggal: '-' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eligibilityDate = addYears(new Date(tmtPangkatTerakhir), 4);
    const searchDate = eligibilityDate > today ? eligibilityDate : today;
    const searchYear = searchDate.getFullYear();
    const searchMonth = searchDate.getMonth();

    const promotionMonths = [1, 3, 5, 7, 9, 11];
    let nextPromotionMonth = promotionMonths.find(promoMonth => promoMonth >= searchMonth);
    let nextPromotionYear = searchYear;

    if (nextPromotionMonth === undefined) {
        nextPromotionMonth = promotionMonths[0];
        nextPromotionYear += 1;
    }

    const jadwalKPFinal = new Date(nextPromotionYear, nextPromotionMonth, 1);

    return {
        status: getStatusText(jadwalKPFinal, today),
        tanggal: formatTanggalLengkap(jadwalKPFinal)
    };
};

export const hitungJadwalKGB = (tmtKgbTerakhir) => {
    if (!tmtKgbTerakhir) return { status: '-', tanggal: '-' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jadwalKGBFinal = addYears(new Date(tmtKgbTerakhir), 2);

    return {
        status: getStatusText(jadwalKGBFinal, today),
        tanggal: formatTanggalLengkap(jadwalKGBFinal)
    };
};