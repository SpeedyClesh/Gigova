// ============================================
// GIGOVA — Complete TypeScript Type Definitions
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserRole = 'worker' | 'client' | 'admin'
export type WorkerTier = 'newcomer' | 'rising' | 'pro' | 'elite'
export type TaskCategory = 
  | 'social_follow'
  | 'social_engage' 
  | 'watch_video'
  | 'write_content'
  | 'fill_survey'
  | 'leave_review'
  | 'web3_quest'
  | 'nft_task'
  | 'community'
  | 'creative'
  | 'translate'
  | 'promote'

export type RewardType = 'usdc' | 'usdt' | 'token' | 'nft_whitelist_gtd' | 'nft_whitelist_fcfs'
export type TaskStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested'
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed'
export type PreferredChain = 
  | 'polygon_usdc' 
  | 'tron_usdt' 
  | 'solana_usdc' 
  | 'bnb_usdt' 
  | 'base_usdc' 
  | 'aptos_usdc'

export type BadgeType =
  | 'first_task'
  | 'ten_tasks'
  | 'fifty_tasks'
  | 'hundred_tasks'
  | 'web3_specialist'
  | 'creative_pro'
  | 'top_earner_week'
  | 'top_earner_month'
  | 'verified_worker'
  | 'rising_star'

// ============================================
// DATABASE TYPES
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      tasks: {
        Row: Task
        Insert: TaskInsert
        Update: TaskUpdate
      }
      submissions: {
        Row: Submission
        Insert: SubmissionInsert
        Update: SubmissionUpdate
      }
      earnings: {
        Row: Earning
        Insert: EarningInsert
        Update: EarningUpdate
      }
      badges: {
        Row: Badge
        Insert: BadgeInsert
        Update: BadgeUpdate
      }
      referrals: {
        Row: Referral
        Insert: ReferralInsert
        Update: ReferralUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ============================================
// PROFILE
// ============================================

export interface Profile {
  id: string                          // matches auth.users.id
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  tier: WorkerTier                    // only relevant for workers
  reputation_score: number            // 0–100
  total_earned: number                // lifetime earnings in USD
  total_tasks_completed: number
  preferred_chain: PreferredChain | null
  wallet_address: string | null       // withdrawal wallet
  bio: string | null
  referral_code: string | null        // unique code to share
  referred_by: string | null          // profile id of referrer
  is_verified: boolean
  is_suspended: boolean
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  role: UserRole
  tier?: WorkerTier
  reputation_score?: number
  total_earned?: number
  total_tasks_completed?: number
  preferred_chain?: PreferredChain | null
  wallet_address?: string | null
  bio?: string | null
  referral_code?: string | null
  referred_by?: string | null
  is_verified?: boolean
  is_suspended?: boolean
}

export interface ProfileUpdate {
  full_name?: string | null
  avatar_url?: string | null
  role?: UserRole
  tier?: WorkerTier
  reputation_score?: number
  total_earned?: number
  total_tasks_completed?: number
  preferred_chain?: PreferredChain | null
  wallet_address?: string | null
  bio?: string | null
  is_verified?: boolean
  is_suspended?: boolean
  updated_at?: string
}

// ============================================
// TASK
// ============================================

export interface Task {
  id: string
  client_id: string                   // profile id of the client
  title: string
  description: string
  category: TaskCategory
  reward_amount: number               // in USD
  reward_type: RewardType
  reward_token_symbol: string | null  // e.g. "MATIC", "SOL" — for token rewards
  reward_nft_project: string | null   // project name for NFT whitelist rewards
  max_workers: number                 // how many workers can do this task
  current_workers: number             // how many have accepted
  completed_count: number             // how many approved
  proof_instructions: string          // what workers must submit as proof
  proof_type: 'screenshot' | 'url' | 'both'
  min_tier: WorkerTier               // minimum tier required
  status: TaskStatus
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface TaskInsert {
  client_id: string
  title: string
  description: string
  category: TaskCategory
  reward_amount: number
  reward_type: RewardType
  reward_token_symbol?: string | null
  reward_nft_project?: string | null
  max_workers?: number
  proof_instructions: string
  proof_type?: 'screenshot' | 'url' | 'both'
  min_tier?: WorkerTier
  status?: TaskStatus
  expires_at?: string | null
}

export interface TaskUpdate {
  title?: string
  description?: string
  reward_amount?: number
  max_workers?: number
  proof_instructions?: string
  status?: TaskStatus
  current_workers?: number
  completed_count?: number
  expires_at?: string | null
  updated_at?: string
}

// ============================================
// SUBMISSION
// ============================================

export interface Submission {
  id: string
  task_id: string
  worker_id: string
  proof_url: string | null            // uploaded file URL from Supabase storage
  proof_link: string | null           // external URL as proof
  proof_notes: string | null          // optional notes from worker
  status: SubmissionStatus
  rejection_reason: string | null
  reviewed_by: string | null          // admin profile id
  reviewed_at: string | null
  submitted_at: string
  updated_at: string
}

export interface SubmissionInsert {
  task_id: string
  worker_id: string
  proof_url?: string | null
  proof_link?: string | null
  proof_notes?: string | null
  status?: SubmissionStatus
}

export interface SubmissionUpdate {
  proof_url?: string | null
  proof_link?: string | null
  proof_notes?: string | null
  status?: SubmissionStatus
  rejection_reason?: string | null
  reviewed_by?: string | null
  reviewed_at?: string | null
  updated_at?: string
}

// ============================================
// EARNING
// ============================================

export interface Earning {
  id: string
  worker_id: string
  task_id: string
  submission_id: string
  amount: number                      // in USD
  reward_type: RewardType
  chain: PreferredChain | null
  wallet_address: string | null
  status: PayoutStatus
  tx_hash: string | null              // blockchain transaction hash
  paid_at: string | null
  created_at: string
}

export interface EarningInsert {
  worker_id: string
  task_id: string
  submission_id: string
  amount: number
  reward_type: RewardType
  chain?: PreferredChain | null
  wallet_address?: string | null
  status?: PayoutStatus
}

export interface EarningUpdate {
  status?: PayoutStatus
  tx_hash?: string | null
  paid_at?: string | null
}

// ============================================
// BADGE
// ============================================

export interface Badge {
  id: string
  worker_id: string
  badge_type: BadgeType
  earned_at: string
}

export interface BadgeInsert {
  worker_id: string
  badge_type: BadgeType
}

export interface BadgeUpdate {
  badge_type?: BadgeType
}

// ============================================
// REFERRAL
// ============================================

export interface Referral {
  id: string
  referrer_id: string                 // who shared the link
  referred_id: string                 // who signed up
  bonus_paid: boolean
  bonus_amount: number
  created_at: string
}

export interface ReferralInsert {
  referrer_id: string
  referred_id: string
  bonus_amount?: number
}

export interface ReferralUpdate {
  bonus_paid?: boolean
}

// ============================================
// UI / COMPONENT TYPES
// ============================================

export interface TaskWithClient extends Task {
  client: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'is_verified'>
}

export interface SubmissionWithTask extends Submission {
  task: Pick<Task, 'id' | 'title' | 'reward_amount' | 'reward_type' | 'category'>
  worker: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'tier' | 'reputation_score'>
}

export interface WorkerStats {
  total_earned: number
  total_tasks: number
  pending_earnings: number
  this_week_earned: number
  reputation_score: number
  tier: WorkerTier
  badges: Badge[]
}

export interface AdminStats {
  total_workers: number
  total_clients: number
  pending_submissions: number
  total_tasks_active: number
  total_gmv: number
  pending_payouts: number
}
