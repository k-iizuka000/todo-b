/**
 * formatting.ts
 * アプリケーション全体で使用するフォーマット関連のユーティリティ関数を提供します。
 */

/**
 * 日付を指定されたフォーマットに変換します
 * @param date - フォーマットする日付
 * @param format - 出力フォーマット（デフォルト: 'YYYY-MM-DD HH:mm'）
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (
  date: Date | string,
  format: string = 'YYYY-MM-DD HH:mm'
): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

/**
 * 数値を通貨形式にフォーマットします
 * @param value - フォーマットする数値
 * @param currency - 通貨コード（デフォルト: 'JPY'）
 * @param locale - ロケール（デフォルト: 'ja-JP'）
 * @returns フォーマットされた通貨文字列
 */
export const formatCurrency = (
  value: number,
  currency: string = 'JPY',
  locale: string = 'ja-JP'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * 文字列を指定された最大長に切り詰めます
 * @param text - 対象の文字列
 * @param maxLength - 最大長
 * @param suffix - 末尾に付加する文字列（デフォルト: '...'）
 * @returns 切り詰められた文字列
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 数値を省略形式にフォーマットします（例: 1.2k, 1.5M）
 * @param value - フォーマットする数値
 * @returns フォーマットされた文字列
 */
export const formatCompactNumber = (value: number): string => {
  if (value < 1000) return value.toString();
  
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  const suffixNum = Math.floor(Math.log10(value) / 3);
  const shortValue = value / Math.pow(1000, suffixNum);
  
  return shortValue.toFixed(1).replace(/\.0$/, '') + suffixes[suffixNum];
};

/**
 * プロンプトの作成日時を相対時間でフォーマットします
 * @param date - 日付
 * @returns 相対時間文字列
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 30) return `${days}日前`;
  
  return formatDate(target, 'YYYY-MM-DD');
};

/**
 * ファイルサイズを人が読みやすい形式にフォーマットします
 * @param bytes - バイト数
 * @returns フォーマットされたファイルサイズ文字列
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};