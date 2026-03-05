import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
    const [isGrayscale, setIsGrayscale] = useState<boolean>(() => {
        return localStorage.getItem('isGrayscale') === 'true';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Force light theme
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');

        // Apply grayscale
        if (isGrayscale) {
            root.classList.add('grayscale');
        } else {
            root.classList.remove('grayscale');
        }
        localStorage.setItem('isGrayscale', isGrayscale.toString());
    }, [isGrayscale]);

    const toggleGrayscale = useCallback(() => {
        setIsGrayscale(prev => !prev);
    }, []);

    return {
        theme: 'light' as const,
        isGrayscale,
        setIsGrayscale,
        toggleGrayscale
    };
}
