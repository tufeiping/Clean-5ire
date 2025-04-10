// import Debug from 'debug';
import { create } from 'zustand';
import {
  AuthError,
  AuthResponse,
  Session,
  Subscription,
  User,
} from '@supabase/supabase-js';

// const debug = Debug('5ire:stores:useAuthStore');

export interface IAuthStore {
  session: Session | null;
  user: User | null;
  avatarUrl: string;
  load: () => Promise<AuthResponse>;
  setSession: (args: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<AuthResponse>;
  signInWithEmailAndPassword: (
    email: string,
    password: string,
  ) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  onAuthStateChange: (
    callback?: (event: any, session: any) => void,
  ) => Subscription;
  saveInactiveUser: (user: User) => void;
  updateUserMetadata: (metadata: { name?: string; avatar?: string }) => void;
  updateAvatar: (url: string) => void;
}

const USER_METADATA_KEY = 'user-metadata';
const AVATAR_FILENAME = 'avatar'; // 固定的头像文件名

// 创建一个模拟用户
const mockUser: User = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: {
    name: 'Demo User',
    avatar: '', // 这里只存储文件名
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@example.com',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

const useAuthStore = create<IAuthStore>((set) => ({
  session: null,
  user: null, // 初始化时不设置用户，等待 load 方法加载
  avatarUrl: '',
  /**
   * 加载有下面几种情况
   * 1. 本地没有 session
   *  1.1 也没有 user 信息
   *  1.2 有 User信息， 这种情况比较特殊， 只有一种可能性，就是用户刚注册，还未通过 Email 确认激活。
   *      这种情况下，我们需要获取本地的 InactiveUser 作为 User信息
   *  2. 本地有 Session
   *    2.1 Session 有效，返回
   *    2.2 Session 过期，返回 null
   */
  load: async () => {
    try {
      // 从本地存储加载用户元数据
      const storedMetadata = localStorage.getItem(USER_METADATA_KEY);
      const metadata = storedMetadata
        ? JSON.parse(storedMetadata)
        : mockUser.user_metadata;

      const user = {
        ...mockUser,
        user_metadata: metadata,
      };

      // 获取头像路径
      const avatarPath = await window.electron.getAvatarPath();
      if (avatarPath) {
        // 添加时间戳防止缓存
        const avatarUrl = `file://${avatarPath}?t=${Date.now()}`;
        user.user_metadata.avatar = avatarUrl;
        set({ user, avatarUrl }); // 同时更新 user 和 avatarUrl
      } else {
        set({ user });
      }

      return {
        data: {
          session: null,
          user,
        },
        error: null,
      } as AuthResponse;
    } catch (error) {
      console.error('Error loading user data:', error);
      return {
        data: {
          session: null,
          user: mockUser,
        },
        error: null,
      } as AuthResponse;
    }
  },

  setSession: async () => {
    return {
      data: {
        session: null,
        user: mockUser,
      },
      error: null,
    } as AuthResponse;
  },

  onAuthStateChange: (callback?: (event: any, session: any) => void) => {
    return {
      id: '0',
      callback: () => {
        if (callback) callback(null, null);
      },
      unsubscribe: () => {},
    } as Subscription;
  },

  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log('signInWithEmailAndPassword', email, password);
    return {
      data: {
        session: null,
        user: mockUser,
      },
      error: null,
    } as AuthResponse;
  },

  signOut: async () => {
    return { error: null };
  },

  saveInactiveUser(user: User) {
    localStorage.setItem('inactive-user', JSON.stringify(user));
    set({ user });
  },

  updateUserMetadata: (metadata: { name?: string; avatar?: string }) => {
    set((state) => {
      if (!state.user) return state;

      const updatedUser = {
        ...state.user,
        user_metadata: {
          ...state.user.user_metadata,
          ...metadata,
        },
      };

      // 只保存名称到本地存储，头像使用文件路径
      const storageMetadata = {
        ...updatedUser.user_metadata,
        avatar: undefined, // 不保存头像URL到localStorage
      };
      localStorage.setItem(USER_METADATA_KEY, JSON.stringify(storageMetadata));

      return { user: updatedUser };
    });
  },

  updateAvatar: (url: string) => set({ avatarUrl: url }),
}));

export default useAuthStore;
