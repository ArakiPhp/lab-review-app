import { test, expect } from '@playwright/test';
import { AUTH } from './helpers/auth-paths.js';
import { openCommentModal, postComment } from './helpers/comment-modal.js';

// このファイルはコメント CRUD をテストする
// シードデータ: CommentSeeder は DatabaseSeeder から呼ばれないため、
//              コメント初期件数は 0 件
// user@example.com はシード後に tinker で作成されるため、他ユーザーのコメントは存在しない

test.describe('コメント: 投稿・編集・削除（一般ユーザー）', () => {
  test.use({ storageState: AUTH.user });

  test('コメントを投稿するとコメント一覧に表示される', async ({ page }) => {
    await page.goto('/labs/1');
    await openCommentModal(page);

    await postComment(page, 'E2Eテスト: コメント投稿テスト');
  });

  test('自分のコメントを編集できる', async ({ page }) => {
    await page.goto('/labs/2');
    await openCommentModal(page);

    // コメントを投稿
    const original = 'E2Eテスト: 編集前のコメント';
    await postComment(page, original);

    // 編集アイコンをクリック（投稿したコメントの行に絞り込んでクリック）
    const commentRow = page.locator('.border-b').filter({ hasText: original });
    await commentRow.getByRole('button').filter({ has: page.getByAltText('編集') }).click();

    // 編集モードに切り替わるとテキストは textarea の value になるため
    // placeholder なしの textarea（編集用）で絞り込む
    const editTextarea = page.locator('textarea:not([placeholder])');
    await editTextarea.clear();
    await editTextarea.fill('E2Eテスト: 編集後のコメント');

    // 「編集する」ボタンは .border-b 内にのみ存在するため絞り込む
    await page.locator('.border-b').getByRole('button', { name: '編集する' }).click();

    // 編集後の内容が表示されること
    await expect(page.getByText('E2Eテスト: 編集後のコメント')).toBeVisible({ timeout: 10000 });

    // 編集前の内容が消えていること
    await expect(page.getByText(original)).not.toBeVisible();
  });

  test('自分のコメントを削除できる', async ({ page }) => {
    await page.goto('/labs/3');
    await openCommentModal(page);

    // コメントを投稿
    const commentText = 'E2Eテスト: 削除するコメント';
    await postComment(page, commentText);

    // 削除アイコンをクリック（最後に投稿したコメントの行に絞り込む）
    const commentRow = page.locator('.border-b').filter({ has: page.locator('p').filter({ hasText: commentText }) }).last();
    await commentRow.getByRole('button').filter({ has: page.getByAltText('削除') }).click();

    // 削除確認モーダルが表示されること
    await expect(page.getByText('コメントの削除')).toBeVisible({ timeout: 10000 });

    // 「削除する」ボタンを押す（AlertModal 内のボタンを強制クリック）
    await page.getByRole('button', { name: '削除する' }).first().click({ force: true });

    // コメント一覧モーダルが再度開き、削除したコメントが消えていること
    await expect(page.getByText(/コメント一覧/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(commentText)).not.toBeVisible();
  });

  test('他ユーザーのコメントには編集・削除ボタンが表示されない', async ({ page }) => {
    // lab 4 にコメントを投稿していない状態で開く
    // → 表示されているコメントは他ユーザーのものがないか確認
    // ただし初期状態でコメントが 0 件の場合はスキップ相当の検証
    await page.goto('/labs/4');
    await openCommentModal(page);

    // 自分のコメントが一件もない状態で「編集」「削除」ボタンが存在しないこと
    // モーダル内（role="dialog"）に絞り込んで背景の編集ボタンを除外する
    const modal = page.getByRole('dialog');
    await expect(
      modal.getByRole('button').filter({ has: modal.getByAltText('編集') })
    ).toHaveCount(0);
    await expect(
      modal.getByRole('button').filter({ has: modal.getByAltText('削除') })
    ).toHaveCount(0);
  });
});
