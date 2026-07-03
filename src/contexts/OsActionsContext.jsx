import { createContext, useContext } from 'react'

const OsActionsContext = createContext(null)

export function OsActionsProvider({ value, children }) {
  return (
    <OsActionsContext.Provider value={value}>
      {children}
    </OsActionsContext.Provider>
  )
}

export function useOsActions() {
  const ctx = useContext(OsActionsContext)
  if (!ctx) {
    throw new Error('useOsActions must be used within OsActionsProvider')
  }
  return ctx
}
