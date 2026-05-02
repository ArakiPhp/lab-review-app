import { request } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_DIR = path.join(__dirname, '.auth');

/** ユーザー種別ごとの認証情報 */
const USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'password',
    authFile: path.join(AUTH_DIR, 'admin.json'),
  },
  user: {
    email: 'user@example.com',
    password: 'password',
    authFile: path.join(AUTH_DIR, 'user.json'),
  },
};

/** XSRF-TOKEN を取得してログインし、storageState を保存する */
async function saveAuthState(email, password, authFile) {
  const context = await request.newContext({ baseURL: 'http://localhost' });

  // GET / で XSRF-TOKEN クッキーを取得
  await context.get('/');

  const state = await context.storageState();
  const xsrfCookie = state.cookies.find((c) => c.name === 'XSRF-TOKEN');
  const xsrfToken = xsrfCookie ? decodeURIComponent(xsrfCookie.value) : '';

  const loginResponse = await context.post('/login', {
    headers: {
      'X-XSRF-TOKEN': xsrfToken,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/html,application/xhtml+xml',
    },
    form: { email, password },
  });

  if (!loginResponse.ok() && loginResponse.status() !== 302) {
    throw new Error(
      `[global-setup] ログイン失敗 (${email}). Status: ${loginResponse.status()}`
    );
  }

  await context.storageState({ path: authFile });
  await context.dispose();
  console.log(`[global-setup] storageState 保存: ${authFile}`);
}

export default async function globalSetup() {
  // DB をリセットしてシードを実行
  console.log('\n[global-setup] Running migrate:fresh --seed ...');
  execSync('docker exec php-lab php artisan migrate:fresh --seed', {
    stdio: 'inherit',
  });

  // 一般ログインユーザー（固定メールアドレス）を作成
  execSync(
    `docker exec php-lab php artisan tinker --execute="\\App\\Models\\User::factory()->create(['email' => 'user@example.com', 'name' => 'テストユーザー', 'email_verified_at' => now()]);"
`,
    { stdio: 'inherit' }
  );

  // .auth ディレクトリを作成
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  // 管理者・一般ユーザーそれぞれの認証状態を生成
  await saveAuthState(USERS.admin.email, USERS.admin.password, USERS.admin.authFile);
  await saveAuthState(USERS.user.email, USERS.user.password, USERS.user.authFile);

  console.log('[global-setup] 完了');
}
