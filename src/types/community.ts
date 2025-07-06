export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  coverImage: string;
  members: CommunityMember[];
  activities: CommunityActivity[];
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  interests: string[];
  joinedAt: string;
  isOnline: boolean;
  user_id: string;
  bio?: string;
}

export interface CommunityActivity {
  id: string;
  type: 'post' | 'experience_share' | 'discussion' | 'event';
  author: CommunityMember;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  images?: string[];
  community_id: string;
}

export interface CommunityComment {
  id: string;
  activity_id: string;
  author: CommunityMember;
  content: string;
  timestamp: string;
  likes: number;
}

export interface CommunityInvite {
  id: string;
  community_id: string;
  from_user: CommunityMember;
  to_user: CommunityMember;
  experience_title: string;
  experience_date: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export type CommunityCategory = 'arte' | 'gastronomia' | 'musica' | 'bem-estar' | 'cultura' | 'all';

export interface CommunityFilters {
  category: CommunityCategory;
  searchTerm: string;
  membershipStatus: 'all' | 'member' | 'non-member';
}