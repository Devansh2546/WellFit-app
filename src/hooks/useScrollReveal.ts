import { useEffect, useRef, useState } from 'react'

/**
 * Attach the returned ref to any element. Returns true once that element
 * has scrolled into view, and stays true afterward (no re-hiding on scroll-out —
 * re-triggering every scroll gets distracting fast).
 */
function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
    const ref = useRef<T | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        // Respect reduced-motion — just show it immediately, no observer needed
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [threshold])

    return { ref, visible }
}

export default useScrollReveal