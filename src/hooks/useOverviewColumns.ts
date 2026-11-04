import { useEffect, useState } from 'react'
import { overviewColumns } from '@/lib/overview'

export function useOverviewColumns() {
  const [cols, setCols] = useState(() => overviewColumns())
  useEffect(() => {
    const onResize = () => setCols(overviewColumns())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}
