import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';
import { fillAllStars } from './helpers/fill-stars.js';

// このファイルは一般ユーザー（user@example.com）として実行されるレビュー CRUD テスト
// シードデータ前提:
//   研究室 id=1〜3: 機械工学科 テストA〜C研究室 (faculty_id=5)
//   user@example.com はシード時に存在しないためレビューを持っていない

test.use({ storageState: AUTH.user });

test.describe('レビュー: 投稿・閲覧', () => {
  test('未投稿の研究室では「まだ、レビューを投稿していません。」が表示される', async ({ page }) => {
    await page.goto('/labs/1');

    await expect(page.getByText('まだ、レビューを投稿していません。')).toBeVisible({
      timeout: 10000,
    });
  });

  test('7項目を入力してレビューを投稿すると「レビューを投稿済みです。」に変わる', async ({
    page,
  }) => {
    await page.goto('/labs/1');

    // 未投稿ボタンをクリックしてモーダルを開く
    await page.getByText('まだ、レビューを投稿していません。').click();
    await expect(page.getByText('レビューを作成する')).toBeVisible({ timeout: 10000 });

    // 7項目すべてに3つ星を入力
    await fillAllStars(page, 3);

    // 投稿ボタンを押す
    await page.getByRole('button', { name: 'レビューする' }).click();

    // 投稿済み状態に変わること
    await expect(page.getByText('レビューを投稿済みです。')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('レビュー: 編集', () => {
  test('投稿済みレビューを編集して保存できる', async ({ page }) => {
    // lab 2 で新規投稿してから編集する（lab 1 の状態に依存しない独立したテスト）
    await page.goto('/labs/2');

    // レビューを投稿
    await page.getByText('まだ、レビューを投稿していません。').click();
    await expect(page.getByText('レビューを作成する')).toBeVisible({ timeout: 10000 });
    await fillAllStars(page, 3);
    await page.getByRole('button', { name: 'レビューする' }).click();
    await expect(page.getByText('レビューを投稿済みです。')).toBeVisible({ timeout: 10000 });

    // 投稿済みボタンをクリックして編集モーダルを開く
    await page.getByText('レビューを投稿済みです。').click();
    await expect(page.getByText('あなたが投稿済したレビュー')).toBeVisible({ timeout: 10000 });

    // 編集アイコンをクリック
    await page.getByRole('button', { name: '編集', exact: true }).click();
    await expect(page.getByText('レビューを編集する')).toBeVisible({ timeout: 10000 });

    // 「指導スタイル」を5星に変更
    const radios = await page
      .getByRole('radiogroup', { name: '指導スタイル' })
      .getByRole('radio')
      .all();
    await radios[4].click({ force: true });

    // 保存
    await page.getByRole('dialog').filter({ hasText: 'レビューを編集する' }).getByRole('button', { name: '編集する' }).click();

    // モーダルが閉じて「投稿済みです」状態が維持されること
    await expect(page.getByText('レビューを投稿済みです。')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('レビュー: 削除', () => {
  test('投稿済みレビューを削除すると未投稿状態に戻る', async ({ page }) => {
    // lab 3 で新規投稿してから削除する
    await page.goto('/labs/3');

    // レビューを投稿
    await page.getByText('まだ、レビューを投稿していません。').click();
    await expect(page.getByText('レビューを作成する')).toBeVisible({ timeout: 10000 });
    await fillAllStars(page, 2);
    await page.getByRole('button', { name: 'レビューする' }).click();
    await expect(page.getByText('レビューを投稿済みです。')).toBeVisible({ timeout: 10000 });

    // 投稿済みボタンをクリックして編集モーダルを開く
    await page.getByText('レビューを投稿済みです。').click();
    await expect(page.getByText('あなたが投稿済したレビュー')).toBeVisible({ timeout: 10000 });

    // 削除アイコンをクリック
    await page.getByRole('button', { name: '削除', exact: true }).click();

    // 削除確認モーダルが表示されること
    await expect(page.getByText('レビューの削除')).toBeVisible({ timeout: 10000 });

    // 「削除する」ボタンを押す
    await page.getByRole('dialog').filter({ hasText: 'レビューの削除' }).getByRole('button', { name: '削除する' }).click();

    // 未投稿状態に戻ること
    await expect(page.getByText('まだ、レビューを投稿していません。')).toBeVisible({
      timeout: 10000,
    });
  });
});
