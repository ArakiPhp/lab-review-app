import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';
import { openMenuAndClick } from './helpers/kebab-menu.js';

// このファイルはコンテンツ作成・編集（大学・学部・研究室）をテストする
// シードデータ前提:
//   大学 id=1: テストA国立大学
//   学部 id=5: 工学部 (university_id=1)
//   研究室 id=1: 機械工学科 テストA研究室 (faculty_id=5)
// 全ログインユーザーが作成・編集可能（Policy: user.exists）

test.use({ storageState: AUTH.user });

// ─────────────────────────────────────────────
// 大学
// ─────────────────────────────────────────────
test.describe('コンテンツ作成: 大学', () => {
  test('マイページの「追加」ボタンで大学を作成できる', async ({ page }) => {
    await page.goto('/mypage');

    // 「追加」ボタンをクリックして大学作成モーダルを開く
    await page.getByRole('button', { name: '追加' }).click();
    await expect(page.getByText('大学を作成する')).toBeVisible({ timeout: 10000 });

    // 大学名を入力
    const uniName = `E2Eテスト大学_${Date.now()}`;
    await page.getByPlaceholder('大学名（正式名称）').fill(uniName);

    // 「作成する」を押す
    await page.getByRole('button', { name: '作成する' }).click();

    // 大学作成後は学部一覧ページにリダイレクトされるため、サイドバーからマイページに戻る
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await page.locator('aside[role="dialog"]').getByRole('link', { name: 'マイページ' }).click();

    // マイページに戻り、作成済み大学セクションに表示されること
    await expect(page.getByRole('link', { name: uniName })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('コンテンツ編集: 大学', () => {
  test('学部一覧ページのケバブメニューから大学を編集できる', async ({ page }) => {
    await page.goto('/universities/1/faculties');

    // ケバブメニュー →「編集する」
    await openMenuAndClick(page, '編集する');
    await expect(page.getByText('大学を編集する')).toBeVisible({ timeout: 10000 });

    // 大学名を変更
    const nameInput = page.getByPlaceholder('大学名（正式名称）');
    await nameInput.clear();
    await nameInput.fill('テストA国立大学（編集済み）');

    // 編集理由を入力
    await page.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト編集');

    // 「編集する」を押す
    await page.getByRole('button', { name: '編集する' }).click();

    // 変更が反映されること
    await expect(page.getByRole('link', { name: 'テストA国立大学（編集済み）' })).toBeVisible({ timeout: 10000 });

    // 元に戻す
    await openMenuAndClick(page, '編集する');
    const nameInput2 = page.getByPlaceholder('大学名（正式名称）');
    await nameInput2.clear();
    await nameInput2.fill('テストA国立大学');
    await page.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト 元に戻す');
    await page.getByRole('button', { name: '編集する' }).click();
    await expect(page.getByRole('link', { name: 'テストA国立大学' })).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// 学部
// ─────────────────────────────────────────────
test.describe('コンテンツ作成: 学部', () => {
  test('学部一覧ページのケバブメニューから学部を作成できる', async ({ page }) => {
    await page.goto('/universities/1/faculties');

    // 学部数を記録
    const beforeText = await page.getByText(/件の学部/).textContent();
    const before = parseInt(beforeText);

    // ケバブメニュー →「学部を追加する」
    await openMenuAndClick(page, '学部を追加する');
    await expect(page.getByText('学部を作成する')).toBeVisible({ timeout: 10000 });

    // 学部名を入力して作成
    const facName = `E2Eテスト学部_${Date.now()}`;
    await page.getByPlaceholder('学部名（正式名称）').fill(facName);
    await page.getByRole('button', { name: '作成する' }).click();

    // 学部作成後は研究室一覧ページにリダイレクトされるため、リダイレクト完了を待ってから学部一覧ページに戻る
    await page.waitForURL(/\/faculties\/\d+\/labs/, { timeout: 10000 });
    await page.goto('/universities/1/faculties');

    // 学部一覧に追加された学部が表示されること
    await expect(page.getByText(facName)).toBeVisible({ timeout: 10000 });

    // 件数が増えていること
    await expect(page.getByText(new RegExp(`${before + 1}件の学部`))).toBeVisible();
  });
});

test.describe('コンテンツ編集: 学部', () => {
  test('研究室一覧ページのケバブメニューから学部を編集できる', async ({ page }) => {
    await page.goto('/faculties/5/labs');

    // ケバブメニュー →「編集する」
    await openMenuAndClick(page, '編集する');
    await expect(page.getByText('学部を編集する')).toBeVisible({ timeout: 10000 });

    // 学部名を変更
    const nameInput = page.getByPlaceholder('学部名（正式名称）');
    await nameInput.clear();
    await nameInput.fill('工学部（編集済み）');
    await page.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト編集');
    await page.getByRole('button', { name: '編集する' }).click();

    // 変更が反映されること（パンくずリストのリンクで確認）
    await expect(page.getByRole('link', { name: '工学部（編集済み）', exact: true })).toBeVisible({ timeout: 10000 });

    // 元に戻す
    await openMenuAndClick(page, '編集する');
    const nameInput2 = page.getByPlaceholder('学部名（正式名称）');
    await nameInput2.clear();
    await nameInput2.fill('工学部');
    await page.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト 元に戻す');
    await page.getByRole('button', { name: '編集する' }).click();
    await expect(page.getByRole('link', { name: '工学部', exact: true })).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// 研究室
// ─────────────────────────────────────────────
test.describe('コンテンツ作成: 研究室', () => {
  test('研究室一覧ページのケバブメニューから研究室を作成できる', async ({ page }) => {
    await page.goto('/faculties/5/labs');

    // 研究室数を記録
    const beforeText = await page.getByText(/件の研究室/).textContent();
    const before = parseInt(beforeText);

    // ケバブメニュー →「研究室を追加する」
    await openMenuAndClick(page, '研究室を追加する');
    await expect(page.getByText('研究室を作成する')).toBeVisible({ timeout: 10000 });

    // 研究室名を入力して作成（必須項目のみ）
    const labName = `E2Eテスト研究室_${Date.now()}`;
    await page.getByPlaceholder('研究室名（正式名称）').fill(labName);
    await page.getByRole('button', { name: '作成する' }).click();

    // 研究室作成後は研究室詳細ページにリダイレクトされるため、リダイレクト完了を待ってから研究室一覧ページに戻る
    await page.waitForURL(/\/labs\/\d+$/, { timeout: 10000 });
    await page.goto('/faculties/5/labs');

    // 研究室一覧に追加された研究室が表示されること
    await expect(page.getByText(labName)).toBeVisible({ timeout: 10000 });

    // 件数が増えていること
    await expect(page.getByText(new RegExp(`${before + 1}件の研究室`))).toBeVisible();
  });
});

test.describe('コンテンツ編集: 研究室', () => {
  test('研究室詳細ページのケバブメニューから研究室を編集できる', async ({ page }) => {
    await page.goto('/labs/1');

    // ケバブメニュー →「編集する」
    await openMenuAndClick(page, '編集する');
    await expect(page.getByText('研究室を編集する')).toBeVisible({ timeout: 10000 });

    // 研究室名を変更
    const nameInput = page.getByPlaceholder('研究室名（正式名称）');
    await nameInput.clear();
    await nameInput.fill('機械工学科 テストA研究室（編集済み）');
    await page.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト編集');
    await page.getByRole('button', { name: '編集する' }).click();

    // 変更が反映されること
    await expect(page.getByRole('link', { name: '機械工学科 テストA研究室（編集済み）', exact: true })).toBeVisible({ timeout: 10000 });

    // 元に戻す
    await openMenuAndClick(page, '編集する');
    const nameInput2 = page.getByPlaceholder('研究室名（正式名称）');
    await nameInput2.clear();
    await nameInput2.fill('機械工学科 テストA研究室');
    await page.getByPlaceholder('編集理由を入力してください').fill('E2Eテスト 元に戻す');
    await page.getByRole('button', { name: '編集する' }).click();
    await expect(page.getByRole('link', { name: '機械工学科 テストA研究室', exact: true })).toBeVisible({ timeout: 10000 });
  });
});
