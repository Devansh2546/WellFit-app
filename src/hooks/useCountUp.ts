import { useEffect, useRef, useState } from 'react'

function useCountUp(target: number, duration = 900) {
    const [value, setValue] = useState(0)
    const startRef = useRef<number | null>(null)

    useEffect(() => {
        if (target === 0) {
            setValue(0)
            return
        }

        // Respect reduced-motion preference — jump straight to the value
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(target)
            return
        }

        startRef.current = null
        let frame: number

        const step = (timestamp: number) => {
            if (startRef.current === null) startRef.current = timestamp
            const progress = Math.min((timestamp - startRef.current) / duration, 1)
            // ease-out cubic — fast start, gentle settle, matches the rest of the UI's easing
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) frame = requestAnimationFrame(step)
        }

        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [target, duration])

    return value
}

export default useCountUp