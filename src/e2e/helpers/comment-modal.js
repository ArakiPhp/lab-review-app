import { expect } from '@playwright/test';

/**
 * コメント一覧モーダルを開くヘルパー
 * コメント件数によってトリガーボタンのラベルが変わるため正規表現で対応
 */
export async function openCommentModal(page) {
  const trigger = page.getByRole('button', {
    name: 'もっと見る',
  });
  await expect(trigger).toBeVisible({ timeout: 10000 });
  await trigger.click();
  await expect(page.getByText(/コメント一覧/)).toBeVisible({ timeout: 10000 });
}

/**
 * コメントを投稿するヘルパー（モーダルが開いている状態で呼ぶ）
 */
export async function postComment(page, text) {
  const textarea = page.getByPlaceholder('コメントを入力...');
  await textarea.click();
  await textarea.fill(text);
  await page.getByRole('button', { name: 'コメントする' }).click();
  await expect(page.locator('p').filter({ hasText: text }).first()).toBeVisible({ timeout: 10000 });
}
