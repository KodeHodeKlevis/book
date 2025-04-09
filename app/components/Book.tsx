'use client';

import React, { useState } from 'react';
import styles from './Book.module.css';

interface Page {
    content: React.ReactNode;
    pageNumber: number;
}

interface BookProps {
    pages: Page[];
    width?: number;
    height?: number;
}

export const Book: React.FC<BookProps> = ({
    pages,
    width = 400,
    height = 600
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const turnPage = (direction: 'next' | 'prev') => {
        if (isFlipping) return;

        setIsFlipping(true);
        if (direction === 'next' && currentPage < pages.length - 2) {
            setCurrentPage(prev => prev + 2);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(prev => prev - 2);
        }

        setTimeout(() => setIsFlipping(false), 1000);
    };

    return (
        <div className={styles.bookContainer} style={{ width, height }}>
            <div className={styles.book}>
                {/* Left page */}
                <div className={styles.page} key={`page-${currentPage}`}>
                    {pages[currentPage]?.content}
                    <div className={styles.pageNumber}>{currentPage + 1}</div>
                </div>

                {/* Right page */}
                <div className={styles.page} key={`page-${currentPage + 1}`}>
                    {pages[currentPage + 1]?.content}
                    <div className={styles.pageNumber}>{currentPage + 2}</div>
                </div>

                {/* Navigation buttons */}
                <button
                    className={`${styles.pageButton} ${styles.prevButton}`}
                    onClick={() => turnPage('prev')}
                    disabled={currentPage === 0 || isFlipping}
                >
                    ←
                </button>
                <button
                    className={`${styles.pageButton} ${styles.nextButton}`}
                    onClick={() => turnPage('next')}
                    disabled={currentPage >= pages.length - 2 || isFlipping}
                >
                    →
                </button>
            </div>
        </div>
    );
};
