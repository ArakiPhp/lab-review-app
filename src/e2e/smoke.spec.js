import { test, expect } from '@playwright/test';

// このファイルはゲスト（未認証）状態で実行される動作確認用スモークテスト

test.describe('スモークテスト: ホーム → 大学検索', () => {
  test('大学名を入力して検索ボタンを押すと、大学一覧ページに遷移する', async ({
    page,
  }) => {
      // 1. ホームページにアクセス（networkidle で React のレンダリング完了を待つ）
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL('/');

    // 2. 検索欄に文字を入力
    const searchInput = page.getByPlaceholder('大学名を入力...');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('テスト');

    // 3. 検索ボタンを押下（type="submit" ボタン）
    await page.getByRole('button', { name: /検索/ }).click();

    // 4. 大学一覧ページに遷移したことを確認
    await expect(page).toHaveURL(new RegExp('/universities\\?query=' + encodeURIComponent('テスト')));
    await expect(page).toHaveTitle(/テスト.*大学一覧/);
  });

  test('検索結果に大学カードが表示される', async ({ page }) => {
    // シードデータに「テスト」を含む大学が存在するため結果が得られる
    await page.goto('/universities?query=テスト', { waitUntil: 'networkidle' });

    // 件数テキストが表示されること
    await expect(page.getByText(/件の検索結果/)).toBeVisible({ timeout: 10000 });

    // 少なくとも1件の大学カードが表示されること
    await expect(page.getByText(/テスト.+大学/).first()).toBeVisible();
  });

  test('空欄では検索ボタンが押せない', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const submitButton = page.getByRole('button', { name: /検索/ });

    // 入力なしの状態では disabled になっていること
    await expect(submitButton).toBeDisabled({ timeout: 10000 });
  });
});
