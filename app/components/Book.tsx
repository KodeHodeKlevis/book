'use client';

import React, { useState, useEffect } from 'react';
import styles from './Book.module.css';

interface Page {
    content: React.ReactNode;
    pageNumber: number;
}

interface Bookmark {
    label: string;
    pageNumber: number;
    color: string;
}

interface BookProps {
    title: string;
    author: string;
    pages: Page[];
    width?: number;
    height?: number;
    bookmarks?: Bookmark[];
}

export const Book: React.FC<BookProps> = ({
    title,
    author,
    pages,
    width = 900,
    height = 600,
    bookmarks = []
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [currentSpread, setCurrentSpread] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [nextSpread, setNextSpread] = useState<number | null>(null);
    const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null);

    const totalSpreads = Math.ceil(pages.length / 2);
    const leftPageIndex = currentSpread * 2;
    const rightPageIndex = leftPageIndex + 1;

    const handleOpen = () => {
        setIsAnimating(true);
        setIsOpen(true);
        setTimeout(() => setIsAnimating(false), 1000);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setCurrentSpread(0);
        }, 1200);
    };

    const calculateSpreadFromPage = (pageNumber: number) => {
        return Math.floor((pageNumber - 1) / 2);
    };

    const handleBookmarkClick = async (pageNumber: number) => {
        if (isFlipping) return;

        const targetSpread = calculateSpreadFromPage(pageNumber);
        if (targetSpread === currentSpread) return;

        setIsFlipping(true);
        const isForward = targetSpread > currentSpread;

        // Animate through each page flip to reach the target
        const animateToSpread = async () => {
            let currentSpreadValue = currentSpread;

            const animate = () => {
                if (isForward && currentSpreadValue < targetSpread) {
                    setFlipDirection('left');
                    currentSpreadValue++;
                    return true;
                } else if (!isForward && currentSpreadValue > targetSpread) {
                    setFlipDirection('right');
                    currentSpreadValue--;
                    return true;
                }
                return false;
            };

            const performAnimation = async () => {
                if (animate()) {
                    setNextSpread(currentSpreadValue);
                    await new Promise(resolve => setTimeout(resolve, 1200)); // Match animation duration
                    setCurrentSpread(currentSpreadValue);
                    await performAnimation();
                }
            };

            await performAnimation();
        };

        await animateToSpread();
        setIsFlipping(false);
        setFlipDirection(null);
        setNextSpread(null);
    };

    const renderPage = (pageIndex: number, isNextSpread: boolean = false) => {
        return pages[pageIndex]?.content || (
            <div className={styles.emptyPage}>
                <p>This page is intentionally left blank</p>
            </div>
        );
    };

    const renderBookmarks = () => (
        <div className={styles.bookmarks}>
            {bookmarks.map((bookmark, index) => (
                <div
                    key={index}
                    className={styles.bookmark}
                    style={{
                        '--bookmark-color': bookmark.color
                    } as React.CSSProperties}
                    onClick={() => handleBookmarkClick(bookmark.pageNumber)}
                >
                    {bookmark.label}
                </div>
            ))}
        </div>
    );

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isOpen || isFlipping || isClosing) return;

            switch (event.key) {
                case 'ArrowRight':
                    if (currentSpread < totalSpreads - 1) {
                        turnPage('next');
                    }
                    break;
                case 'ArrowLeft':
                    if (currentSpread > 0) {
                        turnPage('prev');
                    }
                    break;
                case 'Escape':
                    handleClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, isFlipping, isClosing, currentSpread, totalSpreads]);

    const turnPage = (direction: 'next' | 'prev') => {
        if (isFlipping) return;

        setIsFlipping(true);
        const newSpread = direction === 'next' ? currentSpread + 1 : currentSpread - 1;

        if ((direction === 'next' && currentSpread < totalSpreads - 1) ||
            (direction === 'prev' && currentSpread > 0)) {
            setNextSpread(newSpread);
            setFlipDirection(direction === 'next' ? 'left' : 'right');

            setTimeout(() => {
                setCurrentSpread(newSpread);
                setNextSpread(null);
                setIsFlipping(false);
                setFlipDirection(null);
            }, 1200);
        } else {
            setIsFlipping(false);
        }
    };

    const handleKeyClick = (action: 'prev' | 'next' | 'close') => {
        switch (action) {
            case 'prev':
                if (!isFlipping && currentSpread > 0) {
                    turnPage('prev');
                }
                break;
            case 'next':
                if (!isFlipping && currentSpread < totalSpreads - 1) {
                    turnPage('next');
                }
                break;
            case 'close':
                handleClose();
                break;
        }
    };

    const renderKeyControls = () => (
        <div className={styles.keyControls}>
            <div
                className={`${styles.keyGroup} ${currentSpread === 0 ? styles.disabled : ''}`}
                onClick={() => handleKeyClick('prev')}
            >
                <div className={styles.keyBox}>←</div>
                <span>Previous Page</span>
            </div>
            <div
                className={`${styles.keyGroup} ${currentSpread >= totalSpreads - 1 ? styles.disabled : ''}`}
                onClick={() => handleKeyClick('next')}
            >
                <div className={styles.keyBox}>→</div>
                <span>Next Page</span>
            </div>
            <div
                className={styles.keyGroup}
                onClick={() => handleKeyClick('close')}
            >
                <div className={styles.keyBox}>Esc</div>
                <span>Close Book</span>
            </div>
        </div>
    );

    if (!isOpen) {
        return (
            <div className={styles.bookContainer}>
                <div
                    className={`${styles.book} ${styles.closed} ${isAnimating ? styles.animating : ''}`}
                    onClick={handleOpen}
                    style={{
                        width: isAnimating ? width : 300,
                        height: isAnimating ? height : 400
                    }}
                >
                    <div className={styles.cover}>
                        <h1>{title}</h1>
                        <h2>{author}</h2>
                    </div>
                    <div className={styles.spine}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.bookContainer}>
            <div
                className={`${styles.book} ${styles.open} ${isAnimating ? styles.animating : ''}`}
                style={{ width, height }}
            >
                {renderBookmarks()}

                {/* Current spread */}
                <div
                    className={`${styles.page} ${styles.leftPage} ${isFlipping && flipDirection === 'right' ? styles.flipLeftToRight : ''
                        }`}
                >
                    {pages[leftPageIndex]?.content || (
                        <div className={styles.emptyPage}>
                            <p>This page is intentionally left blank</p>
                        </div>
                    )}
                    <div className={styles.pageNumber}>{leftPageIndex + 1}</div>
                </div>

                <div
                    className={`${styles.page} ${styles.rightPage} ${isFlipping && flipDirection === 'left' ? styles.flipRightToLeft : ''
                        }`}
                >
                    {pages[rightPageIndex]?.content || (
                        <div className={styles.emptyPage}>
                            <p>This page is intentionally left blank</p>
                        </div>
                    )}
                    <div className={styles.pageNumber}>{rightPageIndex + 1}</div>
                </div>

                {/* Next spread pages */}
                {isFlipping && nextSpread !== null && (
                    <>
                        <div
                            className={`${styles.page} ${styles.leftPage}`}
                            style={{
                                position: 'absolute',
                                left: 0,
                                zIndex: flipDirection === 'right' ? 99 : 97
                            }}
                        >
                            {pages[nextSpread * 2]?.content || (
                                <div className={styles.emptyPage}>
                                    <p>This page is intentionally left blank</p>
                                </div>
                            )}
                            <div className={styles.pageNumber}>{nextSpread * 2 + 1}</div>
                        </div>

                        <div
                            className={`${styles.page} ${styles.rightPage}`}
                            style={{
                                position: 'absolute',
                                right: 0,
                                zIndex: flipDirection === 'left' ? 98 : 96
                            }}
                        >
                            {pages[nextSpread * 2 + 1]?.content || (
                                <div className={styles.emptyPage}>
                                    <p>This page is intentionally left blank</p>
                                </div>
                            )}
                            <div className={styles.pageNumber}>{nextSpread * 2 + 2}</div>
                        </div>
                    </>
                )}

                {/* Navigation buttons */}
                {isOpen && (
                    <>
                        <button
                            className={`${styles.pageButton} ${styles.prevButton}`}
                            onClick={() => turnPage('prev')}
                            disabled={currentSpread === 0 || isFlipping}
                        >
                            ←
                        </button>
                        <button
                            className={`${styles.pageButton} ${styles.nextButton}`}
                            onClick={() => turnPage('next')}
                            disabled={currentSpread >= totalSpreads - 1 || isFlipping}
                        >
                            →
                        </button>
                    </>
                )}
            </div>

            {isOpen && (
                <>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                    >
                        Close Book
                    </button>
                    {renderKeyControls()}
                </>
            )}
        </div>
    );
};
