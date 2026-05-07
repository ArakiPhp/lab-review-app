/**
 * 研究室詳細ページで7項目すべてに星評価を入力するヘルパー
 * @param {import('@playwright/test').Page} page
 * @param {number} stars - 1〜5
 */
export async function fillAllStars(page, stars = 3) {
  const labels = [
    '指導スタイル',
    '雰囲気・文化',
    '成果・活動',
    '拘束度',
    '設備',
    '働き方',
    '人数バランス',
  ];
  for (const label of labels) {
    const radios = await page
      .getByRole('radiogroup', { name: label })
      .getByRole('radio')
      .all();
    await radios[stars - 1].click();
  }
}
