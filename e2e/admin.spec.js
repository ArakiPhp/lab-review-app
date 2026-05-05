import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';

// 管理者機能のテスト
// シードデータ前提:
//   admin@example.com (is_admin=true)
//   user@example.com (一般ユーザー)
//   University id=1: テストA国立大学
//   Faculty id=5: 工学部 (university_id=1)
//   Lab id=1: 機械工学科 テストA研究室 (faculty_id=5)

test.use({ storageState: AUTH.admin });

// ─────────────────────────────────────────────
// 削除依頼一覧
// ─────────────────────────────────────────────
test.describe('管理者: 削除依頼一覧', () => {
  test('削除依頼一覧ページにアクセスできる', async ({ page }) => {
    await page.goto('/admin/deletion-requests');

    await expect(page.getByText('削除依頼一覧')).toBeVisible();
    await expect(page.getByRole('button', { name: 'マイページに戻る' })).toBeVisible();
  });

  test('削除依頼がない場合は空状態メッセージが表示される', async ({ page }) => {
    await page.goto('/admin/deletion-requests');

    await expect(page.getByText('削除依頼はありません。')).toBeVisible();
  });

  test('ユーザーが削除依頼を提出すると一覧に表示される', async ({ page, browser }) => {
    // user コンテキストで削除依頼を提出
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/deletion-requests/create/university/1');
    await userPage.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテスト: 管理者向け削除依頼');
    await userPage.getByRole('button', { name: '送信' }).click();
    await expect(userPage.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者で削除依頼一覧を確認
    await page.goto('/admin/deletion-requests');
    await expect(page.getByText('テストA国立大学').first()).toBeVisible();
    await expect(page.getByText('（大学）への削除依頼')).toBeVisible();
    await expect(page.getByText('E2Eテスト: 管理者向け削除依頼')).toBeVisible();
    await expect(page.getByText(/依頼者:/)).toBeVisible();
  });

  test('削除依頼の対象名リンクから対象ページに遷移できる', async ({ page, browser }) => {
    // user コンテキストで削除依頼を提出（前提データ）
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/deletion-requests/create/university/1');
    await userPage.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテスト: 遷移確認');
    await userPage.getByRole('button', { name: '送信' }).click();
    await expect(userPage.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者でリストの対象名をクリック
    await page.goto('/admin/deletion-requests');
    await page.getByText('テストA国立大学').first().click();

    await expect(page).toHaveURL(/\/universities\/1\/faculties/);
  });

  test('「マイページに戻る」ボタンでマイページに遷移できる', async ({ page }) => {
    await page.goto('/admin/deletion-requests');
    await page.getByRole('button', { name: 'マイページに戻る' }).click();

    await expect(page).toHaveURL(/\/mypage/);
  });
});

// ─────────────────────────────────────────────
// アクセス権限
// ─────────────────────────────────────────────
test.describe('管理者: アクセス権限', () => {
  test('一般ユーザーは削除依頼一覧にアクセスできない', async ({ browser }) => {
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();

    const response = await userPage.goto('/admin/deletion-requests');

    // abort(403) によりアクセスが拒否されること
    expect(response.status()).toBe(403);

    await userContext.close();
  });

  test('未ログインユーザーは削除依頼一覧にアクセスするとリダイレクトされる', async ({ browser }) => {
    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();

    await guestPage.goto('/admin/deletion-requests');

    await expect(guestPage).not.toHaveURL(/\/admin\/deletion-requests/);

    await guestContext.close();
  });
});
