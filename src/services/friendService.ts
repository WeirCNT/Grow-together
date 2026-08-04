import type { Goal } from '@/types'
import { getGoals } from './goalService'

export async function getFriendGoals(friendId: string): Promise<Goal[]> {
  return getGoals(friendId)
}
