import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';

// マイページ（一般ユーザー）のテスト
// シードデータ前提:
//   user@example.com (global-setup で tinker 経由で作成、name="テストユーザー")
//   admin が作成した大学・学部・研究室は存在するが、user は何も作成していない初期状態

test.use({ storageState: AUTH.user });

// ─────────────────────────────────────────────
// マイページ表示
// ─────────────────────────────────────────────
test.describe('マイページ: 表示', () => {
  test('マイページにユーザー情報が表示される', async ({ page }) => {
    await page.goto('/mypage');

    // 基本情報セクション
    await expect(page.getByText('基本情報')).toBeVisible();

    // ニックネーム・メールアドレス・パスワードのラベル
    await expect(page.getByText('ニックネーム')).toBeVisible();
    await expect(page.getByText('e-Mailアドレス')).toBeVisible();
    await expect(page.getByText('パスワード')).toBeVisible();

    // 退会リンク
    await expect(page.getByRole('button', { name: '退会' })).toBeVisible();
  });

  test('ブックマーク0件の場合は空状態メッセージが表示される', async ({ page }) => {
    await page.goto('/mypage');

    await expect(page.getByText('ブックマーク済み研究室')).toBeVisible();
    await expect(page.getByText('ブックマーク済みの研究室はありません。')).toBeVisible();
  });

  test('作成済みコンテンツが0件の場合は空状態メッセージが表示される', async ({ page }) => {
    await page.goto('/mypage');

    await expect(page.getByText('作成済みの大学はありません。')).toBeVisible();
    await expect(page.getByText('作成済みの学部はありません。')).toBeVisible();
    await expect(page.getByText('作成済みの研究室はありません。')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// ニックネーム編集
// ─────────────────────────────────────────────
test.describe('マイページ: ユーザー情報編集', () => {
  test('ニックネームを変更して保存できる', async ({ page }) => {
    await page.goto('/mypage');

    // UserInfoBar の鉛筆アイコン（img alt="編集"）をクリックして EditUserModal を開く
    await page.getByAltText('編集').first().click();
    await expect(page.getByText('ユーザー情報を編集する')).toBeVisible({ timeout: 10000 });

    // ニックネームを変更
    const nicknameInput = page.getByPlaceholder('ニックネーム');
    await nicknameInput.clear();
    await nicknameInput.fill('変更後ユーザー名');

    // 保存
    await page.getByRole('button', { name: '更新する' }).click();

    // モーダルが閉じること（opacity: 0 で非表示になるため CSS で確認）
    await expect(page.getByRole('dialog').filter({ hasText: 'ユーザー情報を編集する' })).toHaveCSS('opacity', '0', { timeout: 10000 });

    // 元に戻す
    await page.getByAltText('編集').first().click();
    await expect(page.getByText('ユーザー情報を編集する')).toBeVisible({ timeout: 10000 });
    const nicknameInput2 = page.getByPlaceholder('ニックネーム');
    await nicknameInput2.clear();
    await nicknameInput2.fill('テストユーザー');
    await page.getByRole('button', { name: '更新する' }).click();
    await expect(page.getByRole('dialog').filter({ hasText: 'ユーザー情報を編集する' })).toHaveCSS('opacity', '0', { timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// 退会ページ
// ─────────────────────────────────────────────
test.describe('マイページ: 退会ページ', () => {
  test('退会ページに遷移できる', async ({ page }) => {
    await page.goto('/mypage');

    await page.getByRole('button', { name: '退会' }).click();

    await expect(page).toHaveURL(/\/mypage\/withdrawal/);
    await expect(page.getByText('退会すると、以下のデータがすべて削除されます。')).toBeVisible();
    await expect(page.getByRole('button', { name: '退会する' }).first()).toBeVisible();
    await expect(page.getByText('マイページに戻る')).toBeVisible();
  });

  test('退会ページの「退会する」ボタンで確認モーダルが表示される', async ({ page }) => {
    await page.goto('/mypage/withdrawal');

    await page.getByRole('button', { name: '退会する' }).first().click();

    // AlertModal「退会の確認」が表示される
    await expect(page.getByText('退会の確認')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('退会すると元に戻せません。本当に退会しますか？')).toBeVisible();

    // キャンセルでモーダルが閉じる（opacity: 0 で非表示になるため CSS で確認）
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page.getByRole('dialog').filter({ hasText: '退会の確認' })).toHaveCSS('opacity', '0', { timeout: 10000 });
  });

  test('退会ページから「マイページに戻る」でマイページに戻れる', async ({ page }) => {
    await page.goto('/mypage/withdrawal');

    await page.getByText('マイページに戻る').click();

    await expect(page).toHaveURL(/\/mypage/);
    await expect(page.getByText('基本情報')).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// ブックマーク・作成済みコンテンツが1件以上ある場合
// ─────────────────────────────────────────────
test.describe('マイページ: データあり状態の表示', () => {
  test('ブックマーク済み研究室が1件表示される', async ({ page }) => {
    // lab_id=1 の研究室をブックマーク
    await page.goto('/labs/1');
    await page.locator('svg').filter({ has: page.locator('path[stroke="#747D8C"]') }).click();

    // マイページに移動して確認
    await page.goto('/mypage');
    await expect(page.getByText('ブックマーク済みの研究室はありません。')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/保存済み: [1-9]/)).toBeVisible();
    await expect(page.getByText('1 / 1')).toBeVisible();
  });

  test('作成済み大学が1件表示される', async ({ page }) => {
    // マイページの「追加」ボタンから大学を作成
    await page.goto('/mypage');
    await page.getByRole('button', { name: '追加' }).click();
    await expect(page.getByText('大学を作成する')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('大学名（正式名称）').fill('E2Eテスト大学');
    await page.getByRole('button', { name: '作成する' }).click();

    // 作成後は学部一覧にリダイレクトされるのでマイページに戻る
    await page.goto('/mypage');
    await expect(page.getByText('作成済みの大学はありません。')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('E2Eテスト大学').first()).toBeVisible();
  });

  test('作成済み学部が1件表示される', async ({ page }) => {
    // university_id=1 の学部一覧から学部を追加
    await page.goto('/universities/1/faculties');
    const kebab = page.locator('button').filter({ has: page.locator('circle') }).first();
    await kebab.click();
    await page.getByRole('button', { name: '学部を追加する' }).click();
    await expect(page.getByText('学部を作成する')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('学部名（正式名称）').fill('E2Eテスト学部');
    await page.getByRole('button', { name: '作成する' }).click();

    // 作成後は研究室一覧にリダイレクトされるのでマイページに移動
    await page.goto('/mypage');
    await expect(page.getByText('作成済みの学部はありません。')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('E2Eテスト学部')).toBeVisible();
  });

  test('作成済み研究室が1件表示される', async ({ page }) => {
    // faculty_id=5 の研究室一覧から研究室を追加
    await page.goto('/faculties/5/labs');
    const kebab = page.locator('button').filter({ has: page.locator('circle') }).first();
    await kebab.click();
    await page.getByRole('button', { name: '研究室を追加する' }).click();
    await expect(page.getByText('研究室を作成する')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('研究室名（正式名称）').fill('E2Eテスト研究室');
    await page.getByRole('button', { name: '作成する' }).click();

    // 作成後は研究室詳細にリダイレクトされるのでマイページに移動
    await page.goto('/mypage');
    await expect(page.getByText('作成済みの研究室はありません。')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('E2Eテスト研究室')).toBeVisible();
  });
});

