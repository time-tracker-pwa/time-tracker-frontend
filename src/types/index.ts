export interface TimeEntry {
  id: number
  projectId: number
  description: string
  startTime: number
  endTime: number | null
  duration: number
  synced?: boolean
}

export interface Project {
  id: number
  name: string
  color: string
  synced?: boolean
  description: string
}