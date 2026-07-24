import { useState, useEffect, useCallback, useRef } from 'react';
import { ANIMATION_DURATION_MS } from '../constants/homePageData';

/**
 * Reusable carousel hook with auto-play, pause-on-hover, and
 * keyboard navigation support.
 *
 * @param {number} totalSlides  - number of slides
 * @param {number} intervalMs   - auto-advance interval in ms
 * @param {boolean} [autoPlay=true]
 */
const useCarousel = (totalSlides, intervalMs, autoPlay = true) => {
    const [activeIndex, setActiveIndex]   = useState(0);
    const [isAnimating, setIsAnimating]   = useState(false);
    const [isPaused, setIsPaused]         = useState(false);
    const animationTimer                   = useRef(null);

    const clearAnimationTimer = () => {
        if (animationTimer.current) clearTimeout(animationTimer.current);
    };

    /** Navigate to an arbitrary slide index */
    const goTo = useCallback((index) => {
        if (isAnimating || index === activeIndex || totalSlides < 2) return;
        clearAnimationTimer();
        setIsAnimating(true);
        setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
        animationTimer.current = setTimeout(
            () => setIsAnimating(false),
            ANIMATION_DURATION_MS,
        );
    }, [isAnimating, activeIndex, totalSlides]);

    const next = useCallback(() => {
        goTo(activeIndex + 1);
    }, [goTo, activeIndex]);

    const prev = useCallback(() => {
        goTo(activeIndex - 1);
    }, [goTo, activeIndex]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay || isPaused || totalSlides < 2) return;
        const id = setInterval(next, intervalMs);
        return () => clearInterval(id);
    }, [autoPlay, isPaused, totalSlides, intervalMs, next]);

    // Cleanup on unmount
    useEffect(() => () => clearAnimationTimer(), []);

    return {
        activeIndex,
        isAnimating,
        goTo,
        next,
        prev,
        pause:  () => setIsPaused(true),
        resume: () => setIsPaused(false),
    };
};

export default useCarousel;