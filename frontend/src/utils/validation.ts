/**
 * validation.ts
 * 入力データのバリデーション関数を提供するユーティリティファイル
 */

// メールアドレスのバリデーション
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// パスワードの強度チェック
export const isValidPassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'パスワードは8文字以上である必要があります' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
    return {
      isValid: false,
      message: 'パスワードは大文字、小文字、数字、特殊文字を含む必要があります'
    };
  }
  
  return { isValid: true, message: '' };
};

// ユーザー名のバリデーション
export const isValidUsername = (username: string): { isValid: boolean; message: string } => {
  if (username.length < 3 || username.length > 30) {
    return { isValid: false, message: 'ユーザー名は3文字以上30文字以下である必要があります' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用可能です' };
  }
  
  return { isValid: true, message: '' };
};

// プロンプトのバリデーション
export const isValidPrompt = (prompt: string): { isValid: boolean; message: string } => {
  if (!prompt.trim()) {
    return { isValid: false, message: 'プロンプトを入力してください' };
  }
  
  if (prompt.length > 5000) {
    return { isValid: false, message: 'プロンプトは5000文字以内で入力してください' };
  }
  
  return { isValid: true, message: '' };
};

// タグのバリデーション
export const isValidTag = (tag: string): { isValid: boolean; message: string } => {
  if (!tag.trim()) {
    return { isValid: false, message: 'タグを入力してください' };
  }
  
  if (tag.length > 30) {
    return { isValid: false, message: 'タグは30文字以内で入力してください' };
  }
  
  const tagRegex = /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s-]+$/;
  if (!tagRegex.test(tag)) {
    return { isValid: false, message: 'タグには不正な文字が含まれています' };
  }
  
  return { isValid: true, message: '' };
};

// URL のバリデーション
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 画像ファイルのバリデーション
export const isValidImageFile = (file: File): { isValid: boolean; message: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { isValid: false, message: '対応していないファイル形式です' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, message: 'ファイルサイズは5MB以下にしてください' };
  }
  
  return { isValid: true, message: '' };
};

// コメントのバリデーション
export const isValidComment = (comment: string): { isValid: boolean; message: string } => {
  if (!comment.trim()) {
    return { isValid: false, message: 'コメントを入力してください' };
  }
  
  if (comment.length > 1000) {
    return { isValid: false, message: 'コメントは1000文字以内で入力してください' };
  }
  
  return { isValid: true, message: '' };
};