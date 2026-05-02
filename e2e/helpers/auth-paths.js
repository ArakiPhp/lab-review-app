/**
 * テストで使用する storageState ファイルのパス定義。
 *
 * 使い方:
 *   import { AUTH } from '../helpers/auth-paths.js';
 *
 *   // 認証なし（ゲスト）のテスト → test.use() 不要
 *
 *   // 一般ユーザーのテスト
 *   test.use({ storageState: AUTH.user });
 *
 *   // 管理ユーザーのテスト
 *   test.use({ storageState: AUTH.admin });
 */

/** @type {{ admin: string, user: string }} */
export const AUTH = {
    /** 管理者 (admin@example.com) */
    admin: './e2e/.auth/admin.json',
    /** 一般ユーザー (user@example.com) */
    user: './e2e/.auth/user.json',
};
