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
}

export interface UserState {
  userInfo: UserInfo;
  profile: Profile;
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
