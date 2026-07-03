import { OsActionsContext } from './osActionsContext'

export function OsActionsProvider({ value, children }) {
  return (
    <OsActionsContext.Provider value={value}>
      {children}
    </OsActionsContext.Provider>
  )
}
