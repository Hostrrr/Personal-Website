import { Suspense, lazy, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEMOS } from './registry'
import './DemoShell.css'

const PAGES = {
  bakery: lazy(() => import('./bakery/Page.jsx')),
  barber: lazy(() => import('./barber/Page.jsx')),
  tide: lazy(() => import('./tide/Page.jsx')),
  line: lazy(() => import('./line/Page.jsx')),
  trail: lazy(() => import('./trail/Page.jsx')),
}

export default function DemoShell() {
  const { slug } = useParams()
  const demo = DEMOS.find((item) => item.slug === slug)
  const Page = slug ? PAGES[slug] : null

  useEffect(() => {
    const previous = document.title
    document.title = demo ? `${demo.title} — demo` : 'Demo'
    return () => {
      document.title = previous
    }
  }, [demo])

  return (
    <div className="demo-shell" data-demo={demo ? slug : 'missing'}>
      <Link className="demo-stamp" to="/">← портфолио</Link>
      {Page ? (
        <Suspense fallback={<p className="demo-wait">печать листа…</p>}>
          <Page />
        </Suspense>
      ) : (
        <p className="demo-missing">такого демо нет</p>
      )}
    </div>
  )
}
