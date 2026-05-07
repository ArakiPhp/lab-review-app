import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';

// 削除依頼（一般ユーザー）のテスト
// シードデータ前提:
//   University id=1: テストA国立大学
//   Faculty id=5: 工学部 (university_id=1)
//   Lab id=1: 機械工学科 テストA研究室 (faculty_id=5)

test.use({ storageState: AUTH.user });

const kebabButton = (page) =>
  page.locator('button').filter({ has: page.locator('circle') }).first();

// ─────────────────────────────────────────────
// フォームへの遷移
// ─────────────────────────────────────────────
test.describe('削除依頼: フォーム遷移', () => {
  test('大学ページのメニューから削除依頼フォームに遷移できる', async ({ page }) => {
    await page.goto('/universities/1/faculties');
    await kebabButton(page).click();
    await page.getByRole('button', { name: '削除依頼をする' }).click();

    await expect(page).toHaveURL(/\/deletion-requests\/create\/university\/1/);
    await expect(page.getByText('削除依頼フォーム - テストA国立大学')).toBeVisible();
    await expect(page.getByText('掲載情報の削除をご希望の場合は')).toBeVisible();
  });

  test('学部ページのメニューから削除依頼フォームに遷移できる', async ({ page }) => {
    await page.goto('/faculties/5/labs');
    await kebabButton(page).click();
    await page.getByRole('button', { name: '削除依頼をする' }).click();

    await expect(page).toHaveURL(/\/deletion-requests\/create\/faculty\/5/);
    await expect(page.getByText('削除依頼フォーム - 工学部')).toBeVisible();
  });

  test('研究室ページのメニューから削除依頼フォームに遷移できる', async ({ page }) => {
    await page.goto('/labs/1');
    await kebabButton(page).click();
    await page.getByRole('button', { name: '削除依頼をする' }).click();

    await expect(page).toHaveURL(/\/deletion-requests\/create\/lab\/1/);
    await expect(page.getByText(/削除依頼フォーム - .+/)).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// フォームの操作
// ─────────────────────────────────────────────
test.describe('削除依頼: フォーム操作', () => {
  test('削除依頼を送信すると完了ページが表示される', async ({ page }) => {
    await page.goto('/deletion-requests/create/university/1');

    await page.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテストによる削除依頼です。');
    await page.getByRole('button', { name: '送信' }).click();

    await expect(page.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'ホームへ戻る' })).toBeVisible();
  });

  test('理由が空の場合はバリデーションエラーが表示される', async ({ page }) => {
    await page.goto('/deletion-requests/create/university/1');

    // テキストエリアを空のまま送信
    await page.getByRole('button', { name: '送信' }).click();

    await expect(page.getByText('削除理由は必須項目です。')).toBeVisible({ timeout: 10000 });
  });

  test('「戻る」ボタンで元の大学ページに戻れる', async ({ page }) => {
    await page.goto('/deletion-requests/create/university/1');

    await page.getByRole('button', { name: /大学に戻る/ }).click();

    await expect(page).toHaveURL(/\/universities\/1\/faculties/);
  });

  test('「戻る」ボタンで元の学部ページに戻れる', async ({ page }) => {
    await page.goto('/deletion-requests/create/faculty/5');

    await page.getByRole('button', { name: /学部に戻る/ }).click();

    await expect(page).toHaveURL(/\/faculties\/5\/labs/);
  });

  test('「戻る」ボタンで元の研究室ページに戻れる', async ({ page }) => {
    await page.goto('/deletion-requests/create/lab/1');

    await page.getByRole('button', { name: /研究室に戻る/ }).click();

    await expect(page).toHaveURL(/\/labs\/1/);
  });

  test('完了ページの「ホームへ戻る」でトップページに遷移できる', async ({ page }) => {
    await page.goto('/deletion-requests/create/lab/1');
    await page.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテストによる削除依頼です。');
    await page.getByRole('button', { name: '送信' }).click();
    await expect(page.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'ホームへ戻る' }).click();

    await expect(page).toHaveURL('/');
  });
});

// ─────────────────────────────────────────────
// ゲスト（未ログイン）アクセス
// ─────────────────────────────────────────────
test.describe('削除依頼: ゲストアクセス', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('未ログインで削除依頼フォームにアクセスするとリダイレクトされる', async ({ page }) => {
    await page.goto('/deletion-requests/create/university/1');

    // 認証ページ or トップページにリダイレクトされること
    await expect(page).not.toHaveURL(/\/deletion-requests\/create/);
  });
});
