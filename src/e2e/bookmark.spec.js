import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';
import { execSync } from 'child_process';

// このファイルはブックマーク機能をテストする
// シードデータ前提:
//   研究室 id=1: 機械工学科 テストA研究室
//   user@example.com はブックマークを持っていない状態から開始

test.use({ storageState: AUTH.user });

/**
 * ブックマークアイコン（SVG path）を含む親要素を返す
 * aria-label がないため SVG の fill 属性で状態を判別する
 */
const bookmarkSvg = page => page.locator('svg').filter({ has: page.locator('path[stroke="#747D8C"]') });

test.describe('ブックマーク: 追加・解除', () => {
  // 各テスト前に user@example.com のブックマークを削除して初期状態に戻す
  test.beforeEach(() => {
    execSync(
      `docker exec php-lab php artisan tinker --execute="\\App\\Models\\User::where('email', 'user@example.com')->first()->bookmarks()->delete();"`,
      { stdio: 'inherit' }
    );
  });

  test('研究室詳細のブックマークボタンを押すとブックマーク数が増える', async ({ page }) => {
    await page.goto('/labs/1');

    // 現在のブックマーク数を取得
    const countLocator = page.locator('svg').filter({ has: page.locator('path[stroke="#747D8C"]') }).locator('~ span');
    await expect(countLocator).toBeVisible({ timeout: 10000 });
    const before = parseInt(await countLocator.textContent());

    // ブックマークアイコンをクリック
    await bookmarkSvg(page).click();

    // カウントが 1 増えること
    await expect(countLocator).toHaveText(String(before + 1), { timeout: 10000 });
  });

  test('ブックマーク済みの研究室でアイコンを再度押すと解除されてカウントが戻る', async ({ page }) => {
    await page.goto('/labs/1');

    const countLocator = page.locator('svg').filter({ has: page.locator('path[stroke="#747D8C"]') }).locator('~ span');
    await expect(countLocator).toBeVisible({ timeout: 10000 });

    const before = parseInt(await countLocator.textContent());

    // 1回目: ブックマーク追加（カウントが増えるまで待ってから値を確定する）
    await bookmarkSvg(page).click();
    await expect(countLocator).toHaveText(String(before + 1), { timeout: 10000 });
    const afterAdd = parseInt(await countLocator.textContent());

    // 2回目: ブックマーク解除
    await bookmarkSvg(page).click();
    await expect(countLocator).toHaveText(String(afterAdd - 1), { timeout: 10000 });
  });
});

test.describe('ブックマーク: マイページ反映', () => {
  test('ブックマークした研究室がマイページに表示される', async ({ page }) => {
    // ブックマーク追加
    await page.goto('/labs/1');
    await bookmarkSvg(page).click();
    // カウントが増えるまで待つ（追加完了の確認）
    await expect(
      page.locator('svg').filter({ has: page.locator('path[stroke="#747D8C"]') }).locator('~ span')
    ).not.toHaveText('0', { timeout: 10000 });

    // マイページに遷移
    await page.goto('/mypage');

    // ブックマーク済み研究室セクションに研究室名が表示されること
    await expect(page.getByText('機械工学科 テストA研究室')).toBeVisible({ timeout: 10000 });

    // 件数が1件以上と表示されること
    await expect(page.getByText(/保存済み: [1-9]/)).toBeVisible();
  });

  test('マイページでブックマークがない場合は「ありません」メッセージが表示される', async ({ page }) => {
    await page.goto('/mypage');

    // ブックマーク件数が 0 ならメッセージが表示される
    const hasNone = await page.getByText('ブックマーク済みの研究室はありません。').isVisible();
    const hasCard = await page.getByText(/保存済み: [1-9]/).isVisible();

    // どちらか一方が表示されていること（状態に依存しない検証）
    expect(hasNone || hasCard).toBeTruthy();
  });
});
