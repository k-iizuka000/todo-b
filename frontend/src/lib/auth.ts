import { User } from '@/types/user';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 認証関連の型定義
export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

// 認証関連の関数
export const auth = {
  // サインアップ
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user as User,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // サインイン
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user as User,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // サインアウト
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // 現在のセッションを取得
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // パスワードリセット
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // パスワード更新
  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // ユーザー情報の更新
  async updateProfile(data: Partial<User>): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', data.id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // 認証状態の監視
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

export default auth;