import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';
import { openMenuAndClick } from './helpers/kebab-menu.js';

// 通知機能のテスト
// シードデータ前提:
//   admin@example.com (is_admin=true, University id=1「テストA国立大学」の作成者)
//   user@example.com (一般ユーザー)
//
// 通知の種類:
//   DeletionRequestNotification  : 削除依頼時に管理者に通知
//   ModelChangedNotification     : コンテンツ編集時に作成者に通知
//   DeletionCompletedNotification: 削除完了時に依頼者に通知（削除UIが未実装のためテスト対象外）

// ─────────────────────────────────────────────
// 通知: 一覧ページ (ユーザー)
// ─────────────────────────────────────────────
test.describe('通知: 一覧ページ', () => {
  test.use({ storageState: AUTH.user });

  test('/notifications にアクセスできる', async ({ page }) => {
    await page.goto('/notifications');

    await expect(page.getByText('通知一覧')).toBeVisible();
  });

  test('通知がない場合は「通知はありません。」が表示される', async ({ page }) => {
    await page.goto('/notifications');

    await expect(page.getByText('通知はありません。')).toBeVisible();
  });

  test('「＜ マイページに戻る」でマイページに遷移できる', async ({ page }) => {
    await page.goto('/notifications');
    await page.getByRole('button', { name: '＜ マイページに戻る' }).click();

    await expect(page).toHaveURL(/\/mypage/);
  });
});

// ─────────────────────────────────────────────
// 通知: 削除依頼通知 (管理者)
// ─────────────────────────────────────────────
test.describe('通知: 削除依頼通知', () => {
  test.use({ storageState: AUTH.admin });

  test('ユーザーが削除依頼を提出すると管理者に通知が届く', async ({ page, browser }) => {
    // user コンテキストで削除依頼を提出
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/deletion-requests/create/university/1');
    await userPage.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテスト: 通知確認');
    await userPage.getByRole('button', { name: '送信' }).click();
    await expect(userPage.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者の通知一覧を確認
    await page.goto('/notifications');
    await expect(page.getByText('「テストA国立大学」に削除依頼が届きました。').first()).toBeVisible({ timeout: 10000 });
  });

  test('削除依頼通知をクリックすると削除依頼一覧ページに遷移できる', async ({ page, browser }) => {
    // user コンテキストで削除依頼を提出
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/deletion-requests/create/university/1');
    await userPage.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテスト: 通知クリック遷移確認');
    await userPage.getByRole('button', { name: '送信' }).click();
    await expect(userPage.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者の通知一覧から通知をクリックして遷移を確認（最初の通知をクリック）
    await page.goto('/notifications');
    await page.getByText('「テストA国立大学」に削除依頼が届きました。').first().click();
    await expect(page).toHaveURL(/\/admin\/deletion-requests/);
  });
});

// ─────────────────────────────────────────────
// 通知: モデル変更通知 (管理者)
// ─────────────────────────────────────────────
test.describe('通知: モデル変更通知', () => {
  test.use({ storageState: AUTH.admin });

  test('ユーザーがコンテンツを編集すると作成者（管理者）に通知が届く', async ({ page, browser }) => {
    // user コンテキストで大学（admin 作成）を編集 → admin に通知が届く
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/universities/1/faculties');
    await openMenuAndClick(userPage, '編集する');
    await expect(userPage.getByText('大学を編集する')).toBeVisible({ timeout: 10000 });

    // 大学名はそのまま、編集理由だけ入力して送信（大学名を変えないことで他テストへの影響を避ける）
    await userPage.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト: 通知確認のための編集');
    await userPage.getByRole('button', { name: '編集する' }).click();
    await expect(userPage.getByRole('link', { name: 'テストA国立大学' })).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者の通知一覧に変更通知が表示されることを確認
    await page.goto('/notifications');
    await expect(
      page.getByText('あなたが作成した「テストA国立大学（大学）」が編集されました。').first()
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// 通知: ドロップダウン (管理者)
// ─────────────────────────────────────────────
test.describe('通知: ドロップダウン', () => {
  test.use({ storageState: AUTH.admin });

  test('未読通知がある場合、ベルアイコンに未読バッジが表示される', async ({ page, browser }) => {
    // user コンテキストで削除依頼を提出して通知を生成
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/deletion-requests/create/university/1');
    await userPage.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテスト: バッジ確認');
    await userPage.getByRole('button', { name: '送信' }).click();
    await expect(userPage.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者のマイページでベルアイコンの未読バッジを確認
    await page.goto('/mypage');
    const bellButton = page.getByRole('button', { name: '通知' });
    await expect(bellButton.locator('span.bg-red-500')).toBeVisible({ timeout: 10000 });
  });

  test('ベルアイコンをクリックするとドロップダウンに通知が表示される', async ({ page, browser }) => {
    // user コンテキストで削除依頼を提出して通知を生成
    const userContext = await browser.newContext({ storageState: AUTH.user });
    const userPage = await userContext.newPage();
    await userPage.goto('/deletion-requests/create/university/1');
    await userPage.getByPlaceholder('削除を希望する理由をご記入ください。').fill('E2Eテスト: ドロップダウン表示確認');
    await userPage.getByRole('button', { name: '送信' }).click();
    await expect(userPage.getByText('削除依頼をお送りいただき、ありがとうございました。')).toBeVisible({ timeout: 10000 });
    await userContext.close();

    // 管理者がベルアイコンをクリックしてドロップダウンを開く
    await page.goto('/mypage');
    await page.getByRole('button', { name: '通知' }).click();

    // ドロップダウンに通知メッセージが表示される
    await expect(page.getByText('「テストA国立大学」に削除依頼が届きました。').first()).toBeVisible({ timeout: 10000 });
    // フッターの「すべての通知を見る」リンクが表示される
    await expect(page.getByRole('link', { name: 'すべての通知を見る' })).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 通知: アクセス権限
// ─────────────────────────────────────────────
test.describe('通知: アクセス権限', () => {
  test('未ログインは /notifications にアクセスするとリダイレクトされる', async ({ browser }) => {
    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();

    await guestPage.goto('/notifications');

    await expect(guestPage).not.toHaveURL(/\/notifications/);

    await guestContext.close();
  });
});
