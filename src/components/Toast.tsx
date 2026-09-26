import { useEffect, useState } from 'react'
import '../assets/CSS/Toast.css'

interface NotificationItem {
  type: 'workout' | 'water' | 'motivation'
  message: string
}

const notifications: NotificationItem[] = [
  { type: 'workout', message: "Time for your daily workout! \u{1F4AA}" },
  { type: 'water', message: 'Remember to drink water! \u{1F4A7}' },
  { type: 'motivation', message: 'You got this! Keep pushing forward! \u{1F31F}' },
  { type: 'workout', message: "Let's get moving! Exercise time! \u{231A}\u23F3" },
  { type: 'water', message: 'Stay hydrated! Take a water break. \u{1F6C1}' },
  { type: 'motivation', message: "Believe in yourself! You're capable of amazing things! \u{1F308}" },
  { type: 'workout', message: "You're getting stronger every day! Keep up the good work! \u{1F4AA}\u{1F525}" },
  { type: 'motivation', message: "You're doing great! Keep pushing forward and never give up! \u{1F680}\u2728" },
  { type: 'workout', message: "You're one step closer to your fitness goals! Keep going! \u{1F3CB}\uFE0F\u200D\u2642\uFE0F\u{1F4AF}" },
  { type: 'motivation', message: "You're amazing just the way you are! Keep shining your light! \u{1F31F}\u{1F60A}" },
]

const typeLabels: Record<NotificationItem['type'], string> = {
  workout: 'Workout Reminder',
  water: 'Hydration Check',
  motivation: 'Motivation',
}

function Toast() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState<NotificationItem | null>(null)

  useEffect(() => {
    const picked = notifications[Math.floor(Math.random() * notifications.length)]
    setCurrent(picked)

    const showTimer = setTimeout(() => setVisible(true), 3000)
    const hideTimer = setTimeout(() => setVisible(false), 6000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!current) return null

  return (
    <div className={`notification-panel ${visible ? 'show' : ''}`}>
      <div className="notification-header">
        <span>{typeLabels[current.type]}</span>
        <button className="close-btn" onClick={() => setVisible(false)} aria-label="Close notification">
          &times;
        </button>
      </div>
      <div className="notification-content">{current.message}</div>
    </div>
  )
}

export default Toast