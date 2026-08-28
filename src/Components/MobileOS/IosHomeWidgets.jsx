function ClockFace({ time }) {
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const hourAngle = hours * 30 + minutes * 0.5
  const minuteAngle = minutes * 6

  return (
    <svg className="ios-clock-face" viewBox="0 0 200 200" aria-hidden>
      <circle cx="100" cy="100" r="98" fill="#0d0d0d" />
      {Array.from({ length: 60 }, (_, i) => {
        const angle = (i * 6 - 90) * (Math.PI / 180)
        const isHour = i % 5 === 0
        const inner = isHour ? 74 : 86
        const outer = 93
        return (
          <line
            key={i}
            x1={100 + inner * Math.cos(angle)}
            y1={100 + inner * Math.sin(angle)}
            x2={100 + outer * Math.cos(angle)}
            y2={100 + outer * Math.sin(angle)}
            stroke="#fff"
            strokeWidth={isHour ? 3.2 : 1.2}
            strokeLinecap="round"
            opacity={isHour ? 1 : 0.45}
          />
        )
      })}
      <line
        x1="100"
        y1="100"
        x2={100 + 46 * Math.sin((hourAngle * Math.PI) / 180)}
        y2={100 - 46 * Math.cos((hourAngle * Math.PI) / 180)}
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="100"
        x2={100 + 68 * Math.sin((minuteAngle * Math.PI) / 180)}
        y2={100 - 68 * Math.cos((minuteAngle * Math.PI) / 180)}
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="5.5" fill="#fff" />
    </svg>
  )
}

export default function IosHomeWidgets({ time, locale, t }) {
  const weekday = time.toLocaleDateString(locale, { weekday: 'long' })
  const dayNum = time.getDate()
  const eventTime = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="home-screen__widgets">
      <div className="ios-widget ios-widget--calendar">
        <div className="ios-cal__weekday">{weekday}</div>
        <div className="ios-cal__day">{dayNum}</div>
        <div className="ios-cal__events">
          <div className="ios-cal__event">
            <span className="ios-cal__bar" />
            <span className="ios-cal__event-body">
              <span className="ios-cal__event-title">{t.windows.about}</span>
              <span className="ios-cal__event-time">{eventTime}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="ios-widget ios-widget--clock">
        <ClockFace time={time} />
      </div>
    </div>
  )
}
