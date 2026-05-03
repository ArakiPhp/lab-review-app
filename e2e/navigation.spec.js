import { test, expect } from '@playwright/test';

// このファイルはゲスト（未認証）状態で実行される画面遷移テスト
// シードデータ前提:
//   大学 id=1: テストA国立大学
//   学部 id=5: 工学部 (university_id=1)
//   研究室 id=1: 機械工学科 テストA研究室 (faculty_id=5)

test.describe('ナビゲーション: ホーム → 研究室詳細 までの遷移', () => {
  test('ホーム → 大学一覧 → 学部一覧 → 研究室一覧 → 研究室詳細 の順に遷移できる', async ({
    page,
  }) => {
    // 1. ホームページ
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // 2. 大学名を検索して大学一覧へ
    const searchInput = page.getByPlaceholder('大学名を入力...');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('テストA');
    await page.getByRole('button', { name: /検索/ }).click();
    await expect(page).toHaveURL(/\/universities\?query=/);

    // 3. テストA国立大学のリンクをクリックして学部一覧へ
    await page.getByText('テストA国立大学').first().click();
    await expect(page).toHaveURL(/\/universities\/1\/faculties/);

    // 4. 工学部をクリックして研究室一覧へ
    await expect(page.getByText('工学部')).toBeVisible({ timeout: 10000 });
    await page.getByText('工学部').click();
    await expect(page).toHaveURL(/\/faculties\/5\/labs/);

    // 5. 機械工学科 テストA研究室をクリックして研究室詳細へ
    await expect(page.getByText('機械工学科 テストA研究室')).toBeVisible({ timeout: 10000 });
    await page.getByText('機械工学科 テストA研究室').first().click();
    await expect(page).toHaveURL(/\/labs\/1/);
  });

  test('研究室詳細ページに7項目の評価が表示される', async ({ page }) => {
    await page.goto('/labs/1');

    // 7つの評価項目ラベルがすべて存在すること
    const ratingLabels = [
      '指導スタイル',
      '雰囲気・文化',
      '成果・活動',
      '拘束度',
      '設備',
      '働き方',
      '人数バランス',
    ];

    for (const label of ratingLabels) {
      await expect(page.getByText(label).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('研究室詳細のコメントセクションがゲストでも表示される', async ({ page }) => {
    await page.goto('/labs/1');

    // 「もっと見る...」をクリックしてコメント一覧モーダルを開く
    await page.getByText('もっと見る...').click();

    // コメント一覧モーダルが表示されること
    await expect(page.getByRole('heading', { name: /コメント一覧/ })).toBeVisible({ timeout: 10000 });
  });

  test('存在しない研究室IDにアクセスするとエラーページが表示される', async ({ page }) => {
    const response = await page.goto('/labs/999999');

    // 404 レスポンス、またはエラーを示すコンテンツが表示されること
    const status = response?.status();
    const is404 = status === 404;
    const hasErrorText = await page.getByText(/404|ページが見つかりません/).isVisible().catch(() => false);

    expect(is404 || hasErrorText).toBeTruthy();
  });

  test('大学の変更履歴ページが表示される', async ({ page }) => {
    await page.goto('/universities/1/history');

    // 履歴ページがレンダリングされること（タイトルまたは履歴に関するテキスト）
    await expect(page.getByText('編集履歴').first()).toBeVisible({ timeout: 10000 });

    // 「大学に戻る」ボタンで学部一覧ページへ戻れること
    await page.getByRole('button', { name: '＜ 大学に戻る' }).click();
    await expect(page).toHaveURL(/\/universities\/1\/faculties/);
  });

  test('学部の変更履歴ページが表示される', async ({ page }) => {
    await page.goto('/faculties/5/history');

    await expect(page.getByText('編集履歴').first()).toBeVisible({ timeout: 10000 });

    // 「学部に戻る」ボタンで学部一覧ページへ戻れること
    await page.getByRole('button', { name: '＜ 学部に戻る' }).click();
    await expect(page).toHaveURL(/\/universities\/1\/faculties/);
  });

  test('研究室の変更履歴ページが表示される', async ({ page }) => {
    await page.goto('/labs/1/history');

    await expect(page.getByText('編集履歴').first()).toBeVisible({ timeout: 10000 });

    // 「研究室に戻る」ボタンで研究室詳細ページへ戻れること
    await page.getByRole('button', { name: '＜ 研究室に戻る' }).click();
    await expect(page).toHaveURL(/\/labs\/1/);
  });
});
