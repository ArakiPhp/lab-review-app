<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Lab;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $labs = Lab::all();

        // サンプルコメントのテンプレート
        $commentTemplates = [
            '研究室の雰囲気がとても良さそうですね。',
            'この研究室に興味があります。もう少し詳しく教えていただけますか？',
            '設備が充実していて魅力的です。',
            '研究テーマがとても興味深いです。',
            '先輩方の就職実績が気になります。',
            'ゼミの進め方について教えてください。',
            '週何日くらい研究室に通っていますか？',
            'コアタイムはありますか？',
            '学会発表の機会は多いですか？',
            '他大学との共同研究はありますか？',
            '研究室見学は可能でしょうか？',
            'プログラミングのスキルはどの程度必要ですか？',
            '院進学を考えているのですが、おすすめですか？',
            '就職活動と研究の両立は大変ですか？',
            '先生との距離感はどのような感じですか？',
            '研究室のイベントはありますか？',
            'とても参考になりました。ありがとうございます！',
            '私も同じ研究室を検討中です。',
            '実際に配属されてみてどうでしたか？',
            '英語力はどの程度求められますか？',
        ];

        // 各研究室に対して1〜5件のコメントを生成
        foreach ($labs as $lab) {
            $commentCount = rand(1, 5);
            $selectedUsers = $users->random(min($commentCount, $users->count()));

            foreach ($selectedUsers as $user) {
                Comment::create([
                    'user_id' => $user->id,
                    'lab_id' => $lab->id,
                    'content' => $commentTemplates[array_rand($commentTemplates)],
                ]);
            }
        }
    }
}
