import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';
import { openLoginModal } from './helpers/login-modal.js';

// このファイルはゲスト（未認証）状態をベースに認証フローをテストする
// ログインはサイドバー → ログインモーダル経由で行う

test.describe('認証: ログインモーダル', () => {
  test('サイドバーの「ログイン」ボタンでモーダルが開く', async ({ page }) => {
    await page.goto('/');

    // ハンバーガーボタンでサイドバーを開く
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await expect(page.locator('aside[role="dialog"]')).toBeVisible({ timeout: 10000 });

    // サイドバー内の「ログイン」ボタンをクリック
    await page.locator('aside[role="dialog"]').getByRole('button', { name: 'ログイン' }).click();

    // ログインモーダルのフォームが表示されること
    await expect(page.getByPlaceholder('メールアドレス')).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('パスワード')).toBeVisible();
  });

  test('正しい認証情報でログインするとモーダルが閉じて同じページに留まる', async ({ page }) => {
    await page.goto('/');
    await openLoginModal(page);

    await page.getByPlaceholder('メールアドレス').fill('user@example.com');
    await page.getByPlaceholder('パスワード').fill('password');
    await page.locator('form:has([placeholder="メールアドレス"]) button[type="submit"]').click();

    // モーダルが閉じること（入力欄が非表示になる）
    await expect(page.getByPlaceholder('メールアドレス')).not.toBeVisible({ timeout: 10000 });

    // URL が / のまま留まること
    await expect(page).toHaveURL('/');

    // サイドバーを再度開くとログイン済み状態（ログアウトボタン）が表示されること
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await expect(
      page.locator('aside[role="dialog"]').getByRole('button', { name: 'ログアウト' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('誤ったパスワードでログインするとエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/');
    await openLoginModal(page);

    await page.getByPlaceholder('メールアドレス').fill('user@example.com');
    await page.getByPlaceholder('パスワード').fill('wrongpassword');
    await page.locator('form:has([placeholder="メールアドレス"]) button[type="submit"]').click();

    // モーダルが開いたまま、エラーメッセージが表示されること
    await expect(page.getByPlaceholder('メールアドレス')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません。')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('認証: ログアウト', () => {
  test.use({ storageState: AUTH.user });

  test('サイドバーの「ログアウト」でログアウトするとゲスト状態に戻る', async ({ page }) => {
    await page.goto('/');

    // ログイン済み状態でサイドバーを開く
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    const logoutButton = page.locator('aside[role="dialog"]').getByRole('button', { name: 'ログアウト' });
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
    await logoutButton.click();

    // ログアウト後にサイドバーを再度開くとゲスト状態（ログインボタン）が表示されること
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await expect(
      page.locator('aside[role="dialog"]').getByRole('button', { name: 'ログイン' })
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('認証: 未認証アクセスのリダイレクト', () => {
  test('未認証で /mypage にアクセスすると / にリダイレクトされる', async ({ page }) => {
    await page.goto('/mypage');

    await expect(page).toHaveURL('/');
  });

  test('未認証で /notifications にアクセスすると / にリダイレクトされる', async ({ page }) => {
    await page.goto('/notifications');

    await expect(page).toHaveURL('/');
  });
});
