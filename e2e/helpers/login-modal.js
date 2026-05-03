import { expect } from '@playwright/test';

/** サイドバーを開いてログインモーダルを表示するヘルパー */
export async function openLoginModal(page) {
  await page.getByRole('button', { name: 'メニューを開く' }).click();
  await page.locator('aside[role="dialog"]').getByRole('button', { name: 'ログイン' }).click();
  // モーダルのメールアドレス入力欄が表示されるまで待つ
  await expect(page.getByPlaceholder('メールアドレス')).toBeVisible({ timeout: 10000 });
}
