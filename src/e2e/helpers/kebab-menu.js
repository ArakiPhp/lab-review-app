/**
 * ケバブメニューを開いて指定ラベルのメニューアイテムを押すヘルパー
 * @param {import('@playwright/test').Page} page
 * @param {string} label - メニューアイテムのラベル
 */
export async function openMenuAndClick(page, label) {
  // KebabIcon は SVG circle 3つで構成されるボタン
  const kebab = page.locator('button').filter({ has: page.locator('circle') }).first();
  await kebab.click();
  // メニューポップオーバー内のボタンに絞り込む（送信ボタンとの衝突を避ける）
  await page.getByRole('listitem').filter({ hasText: label }).getByRole('button').click();
}
