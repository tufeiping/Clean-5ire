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
}

const useAuthStore = create<IAuthStore>((set) => ({
  session: null,
  user: null,
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
    return {
      data: {
        session: null,
        user: null,
      },
      error: null,
    } as AuthResponse;
  },

  setSession: async () => {
    return {
      data: {
        session: null,
        user: null,
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
        user: null,
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
}));

export default useAuthStore;
