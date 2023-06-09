import { cs } from '@/utils/storage'
import userImage from '@/assets/icons/ChatGPT_logo2.svg'

const LOCAL_NAME = 'userStorage'

export interface Profile {
  avatarUrl?:string|null;
  description?:string|null;
  gender?:string|null;
  nickname?:string|null;
  settings?: {
    [key:string]: any;
  }|null
}

export interface UserInfo {
  userId: string;
  username: string;
  role: string;
  email: string|null;
  equities: [];
  phone: string;
  registrations: []; // 
  profile: Profile;
  tokenUsages: TokenUsage[];
}

export interface TokenUsage {
  dayUsage: number;
  hourUsage: number;
  minuteUsage: number;
  monthUsage: number;
  totalUsage: number;
  model: 'GPT3_5'|'GPT4';
}

export interface UserState {
  userInfo: UserInfo;
}

export function defaultInfo(): any {
  return {
    username: 'vistor',
  }
}

export function defualtProfile():any {
  return {
    avatarUrl: '',
    description: '',
  }
}

export function defualtTokenUsage():any {
  return {
    'GPT3_5': {
      dayUsage: 0,
      hourUsage: 0,
      minuteUsage: 0,
      monthUsage: 0,
      totalUsage: 0,
    },
    'GPT4': {
      dayUsage: 0,
      hourUsage: 0,
      minuteUsage: 0,
      monthUsage: 0,
      totalUsage: 0,
    }
  }
}
