import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../assets/CSS/Routeloadingbar.css'

function RouteLoadingBar() {
    const location = useLocation()
    const [active, setActive] = useState(false)

    useEffect(() => {
        // Fires on every route change. Real data fetching happens inside each
        // page component already — this is a lightweight perceived-progress
        // cue, not tied to an actual network request finishing.
        setActive(true)
        const t = setTimeout(() => setActive(false), 450)
        return () => clearTimeout(t)
    }, [location.pathname])

    if (!active) return null

    return <div className="route-loading-bar" />
}

export default RouteLoadingBar