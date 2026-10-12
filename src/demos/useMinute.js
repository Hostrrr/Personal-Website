import { useSyncExternalStore } from 'react'

function subscribe(onChange) {
  const id = setInterval(onChange, 15000)
  return () => clearInterval(id)
}

const snapshot = () => Math.floor(Date.now() / 60000)

export default function useMinute() {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

export function localParts(minute) {
  const date = new Date(minute * 60000)
  return {
    day: date.getDay(),
    minutes: date.getHours() * 60 + date.getMinutes(),
    date,
  }
}

export function formatClock(total) {
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
