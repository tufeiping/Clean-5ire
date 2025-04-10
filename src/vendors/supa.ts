// 模拟 Supabase 客户端
const mockClient = {
  from: (table: string) => ({
    select: (query?: string) => ({
      eq: (field: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      order: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: () => ({
        is: () => ({
          is: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      }),
    }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () =>
      Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: Function) => {
      callback('SIGNED_OUT', null);
      return {
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      };
    },
  },
};

export default mockClient;
