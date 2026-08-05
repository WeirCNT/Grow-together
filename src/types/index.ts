export interface Profile {
  id: string
  student_id: string
  full_name: string
  avatar: string | null
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
}

export interface DailyCheckin {
  id: string
  goal_id: string
  date: string
}

export interface Friend {
  id: string
  user_id: string
  friend_id: string
  created_at: string
}

export interface Support {
  id: string
  goal_id: string
  from_user: string
  message: string
  created_at: string
}

export interface GoalWithCheckins extends Goal {
  checkins: DailyCheckin[]
  streak: number
  completionRate: number
}

export interface FriendWithProfile extends Friend {
  profile: Profile
}

export interface SupportWithProfile extends Support {
  profile: Profile
}

export interface SupporterInfo {
  user_id: string
  profile: Profile
  last_encouraged_at: string
  total_encouragements: number
}

export interface GoalSupportSummary {
  totalCount: number
  uniqueSupportersCount: number
  userHasEncouragedToday: boolean
  userTotalEncouragements: number
  recentSupporters: SupporterInfo[]
}

export interface AppNotification {
  id: string
  user_id: string
  from_user: string
  goal_id: string
  message: string
  is_read: boolean
  created_at: string
  from_profile?: Profile
  goal_title?: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      goals: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'created_at'>
        Update: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>
      }
      daily_checkins: {
        Row: DailyCheckin
        Insert: Omit<DailyCheckin, 'id'>
        Update: Partial<Omit<DailyCheckin, 'id'>>
      }
      friends: {
        Row: Friend
        Insert: Omit<Friend, 'id' | 'created_at'>
        Update: Partial<Omit<Friend, 'id' | 'created_at'>>
      }
      supports: {
        Row: Support
        Insert: Omit<Support, 'id' | 'created_at'>
        Update: Partial<Omit<Support, 'id' | 'created_at'>>
      }
      notifications: {
        Row: AppNotification
        Insert: Omit<AppNotification, 'id' | 'created_at'>
        Update: Partial<Omit<AppNotification, 'id' | 'created_at'>>
      }
    }
  }
}
