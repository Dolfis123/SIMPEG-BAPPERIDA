// src/components/common/usePagination.js
import { useMemo } from "react";

export const DOTS = "...";

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalItems,
  itemsPerPage,
  siblingCount = 1, // Jumlah halaman di sisi kiri & kanan dari halaman saat ini
  currentPage,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalItems / itemsPerPage);

    // Jumlah total item yang ditampilkan di bar paginasi:
    // 1 (halaman pertama) + 1 (halaman terakhir) + currentPage + (2 * siblingCount) + 2 (DOTS)
    const totalPageNumbers = siblingCount + 5;

    // Kasus 1: Jika jumlah halaman lebih sedikit dari angka yang ingin kita tampilkan,
    // tampilkan semua nomor halaman.
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Kasus 2: Tidak ada DOTS di kiri, tapi ada di kanan
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    // Kasus 3: Tidak ada DOTS di kanan, tapi ada di kiri
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Kasus 4: Ada DOTS di kiri dan kanan
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalItems, itemsPerPage, siblingCount, currentPage]);

  return paginationRange;
};
