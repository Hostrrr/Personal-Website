import { useContext } from 'react'
import { OsActionsContext } from '../contexts/osActionsContext'

export function useOsActions() {
  const ctx = useContext(OsActionsContext)
  if (!ctx) {
    throw new Error('useOsActions must be used within OsActionsProvider')
  }
  return ctx
}
