'use client'; // This tells Next.js that this is a client-side component.

import React, { useState, useEffect } from 'react';
import styles from './Book.module.css'; // Importing the CSS module for scoped styles

// Interface defining what a single page consists of
interface Page {
    content: React.ReactNode; // Content of the page (JSX)
    pageNumber: number;       // The page number
}

// Interface defining what a bookmark looks like
interface Bookmark {
    label: string;       // Label shown on the bookmark
    pageNumber: number;  // The page number this bookmark links to
    color: string;       // Color for styling the bookmark
}

// Props accepted by the Book component
interface BookProps {
    title: string;        // Title of the book
    author: string;       // Author's name
    pages: Page[];        // Array of page objects
    width?: number;       // Optional width of the book (default: 900)
    height?: number;      // Optional height of the book (default: 600)
    bookmarks?: Bookmark[]; // Optional list of bookmarks
}

export const Book: React.FC<BookProps> = ({
    title,
    author,
    pages,
    width = 900,
    height = 600,
    bookmarks = []
}) => {
    // Component state
    const [isOpen, setIsOpen] = useState(false);           // Book is open or closed
    const [isClosing, setIsClosing] = useState(false);     // Is the book currently closing
    const [currentSpread, setCurrentSpread] = useState(0); // Which spread (pair of pages) is being shown
    const [isFlipping, setIsFlipping] = useState(false);   // Is a page flipping animation occurring
    const [isAnimating, setIsAnimating] = useState(false); // General animation state (e.g. opening book)
    const [nextSpread, setNextSpread] = useState<number | null>(null); // Spread to show after flipping
    const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null); // Flip direction
    const [hideContent, setHideContent] = useState(false); // Whether to hide page content during animation

    const totalSpreads = Math.ceil(pages.length / 2); // Total number of spreads (2 pages per spread)
    const leftPageIndex = currentSpread * 2;          // Left page index in the current spread
    const rightPageIndex = leftPageIndex + 1;         // Right page index

    // Open the book with animation
    const handleOpen = () => {
        setIsAnimating(true);
        setIsOpen(true);
        setTimeout(() => setIsAnimating(false), 1000); // Simulate animation delay
    };

    // Close the book with animation and reset to first spread
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setCurrentSpread(0);
        }, 1200); // Match with CSS animation duration
    };

    // Converts page number to spread index
    const calculateSpreadFromPage = (pageNumber: number) => {
        return Math.floor((pageNumber - 1) / 2);
    };

    // Navigate to a specific page via bookmark
    const handleBookmarkClick = async (pageNumber: number) => {
        if (isFlipping) return;

        const targetSpread = calculateSpreadFromPage(pageNumber);
        if (targetSpread === currentSpread) return;

        setIsFlipping(true);
        setHideContent(true);

        // Determine flip direction
        const flipDirection = targetSpread > currentSpread ? 'left' : 'right';
        setFlipDirection(flipDirection);
        setNextSpread(targetSpread);

        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show new spread
        setCurrentSpread(targetSpread);
        setHideContent(false);
        setIsFlipping(false);
        setFlipDirection(null);
        setNextSpread(null);
    };

    // Render a single page's content, or fallback if blank
    const renderPage = (pageIndex: number, isNextSpread: boolean = false) => {
        return pages[pageIndex]?.content || (
            <div className={styles.emptyPage}>
                <p>This page is intentionally left blank</p>
            </div>
        );
    };

    // Render bookmarks in the sidebar
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

    // Keyboard controls for navigation
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

    // Flip page left or right
    const turnPage = (direction: 'next' | 'prev') => {
        if (isFlipping) return;

        setIsFlipping(true);
        setHideContent(true);

        const newSpread = direction === 'next' ? currentSpread + 1 : currentSpread - 1;

        if ((direction === 'next' && currentSpread < totalSpreads - 1) ||
            (direction === 'prev' && currentSpread > 0)) {
            setNextSpread(newSpread);
            setFlipDirection(direction === 'next' ? 'left' : 'right');

            // Delay to allow animation to complete
            setTimeout(() => {
                setCurrentSpread(newSpread);
                setNextSpread(null);
                setHideContent(false);
                setIsFlipping(false);
                setFlipDirection(null);
            }, 1200);
        } else {
            setHideContent(false);
            setIsFlipping(false);
        }
    };

    // Handles click events on UI buttons
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

    // Renders keyboard shortcut hints
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

    // UI when book is closed
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

    // UI when book is open
    return (
        <div className={styles.bookContainer}>
            <div
                className={`${styles.book} ${styles.open} ${isAnimating ? styles.animating : ''}`}
                style={{ width, height }}
            >
                {renderBookmarks()}

                {/* Left page of current spread */}
                <div
                    className={`${styles.page} ${styles.leftPage} ${isFlipping && flipDirection === 'right' ? styles.flipLeftToRight : ''}`}
                >
                    <div className={`${styles.pageContent} ${hideContent ? styles.hideContent : ''}`}>
                        {renderPage(leftPageIndex)}
                        <div className={styles.pageNumber}>{leftPageIndex + 1}</div>
                    </div>
                </div>

                {/* Right page of current spread */}
                <div
                    className={`${styles.page} ${styles.rightPage} ${isFlipping && flipDirection === 'left' ? styles.flipRightToLeft : ''}`}
                >
                    <div className={`${styles.pageContent} ${hideContent ? styles.hideContent : ''}`}>
                        {renderPage(rightPageIndex)}
                        <div className={styles.pageNumber}>{rightPageIndex + 1}</div>
                    </div>
                </div>

                {/* Background pages shown during flipping */}
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
                            <div className={`${styles.pageContent} ${styles.hideContent}`}>
                                {renderPage(nextSpread * 2)}
                                <div className={styles.pageNumber}>{nextSpread * 2 + 1}</div>
                            </div>
                        </div>

                        <div
                            className={`${styles.page} ${styles.rightPage}`}
                            style={{
                                position: 'absolute',
                                right: 0,
                                zIndex: flipDirection === 'left' ? 98 : 96
                            }}
                        >
                            <div className={`${styles.pageContent} ${styles.hideContent}`}>
                                {renderPage(nextSpread * 2 + 1)}
                                <div className={styles.pageNumber}>{nextSpread * 2 + 2}</div>
                            </div>
                        </div>
                    </>
                )}

                {/* Left and right navigation buttons */}
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

            {/* Controls at the bottom: close + key hints */}
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

export default Book;