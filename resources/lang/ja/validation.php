<?php

return [
    // 基本的なバリデーションメッセージ
    'required' => ':attribute は必須項目です。',
    'string' => ':attribute は文字列である必要があります。',
    'unique' => 'この:attribute は既に登録されています。',

    'email' => ':attribute は有効なメールアドレスである必要があります。',
    'confirmed' => ':attribute の確認が一致しません。',
    'min' => [
        'string'  => ':attribute は :min 文字以上にしてください。',
    ],

    'max' => [
        'numeric' => ':attribute は :max 以下の値にしてください。',
        'file'    => ':attribute は :max KB以下のファイルにしてください。',
        'string'  => ':attribute は :max 文字以下にしてください。',
        'array'   => ':attribute は :max 個以下にしてください。',
    ],

    'custom' => [
        // 大学関連
        'name' => [
            'unique' => 'この大学名は既に作成されています。',
            'required' => '大学名は必須項目です。',
            'max' => '大学名は50文字以下にしてください。',
        ],
        
        // 学部関連
        'faculty.name' => [
            'unique' => 'この学部名は既にこの大学に存在します。',
            'required' => '学部名は必須項目です。',
            'max' => '学部名は50文字以下にしてください。',
        ],

        // 研究室関連
        'lab.name' => [
            'unique' => 'この研究室名は既にこの学部に存在します。',
            'required' => '研究室名は必須項目です。',
            'max' => '研究室名は50文字以下にしてください。',
        ],
        'description' => [
            'max' => '説明は150文字以下にしてください。',
        ],
        'professor_name' => [
            'max' => '教授名は25文字以下にしてください。',
        ],
        'url' => [
            'url' => 'URLは有効なURL形式で入力してください。',
        ],
        'professor_url' => [
            'url' => '教授のURLは有効なURL形式で入力してください。',
        ],

        // 削除依頼関連
        'reason' => [
            'required' => '削除理由は必須項目です。',
            'max' => '削除理由は1000文字以下にしてください。',
        ],

        // レビュー関連
        'mentorship_style' => [
            'required' => '指導スタイルは必須です',
            'max' => '指導スタイルは5以下の値にしてください。',
            'min' => '指導スタイルは1以上の値にしてください。',
        ],
        'lab_atmosphere' => [
            'required' => '雰囲気・文化は必須です',
            'max' => '雰囲気・文化は5以下の値にしてください。',
            'min' => '雰囲気・文化は1以上の値にしてください。',
        ],
        'achievement_activity' => [
            'required' => '成果・活動は必須です',
            'max' => '成果・活動は5以下の値にしてください。',
            'min' => '成果・活動は1以上の値にしてください。',
        ],
        'constraint_level' => [
            'required' => '拘束度は必須です',
            'max' => '拘束度は5以下の値にしてください。',
            'min' => '拘束度は1以上の値にしてください。',
        ],
        'facility_quality' => [
            'required' => '設備は必須です',
            'max' => '設備は5以下の値にしてください。',
            'min' => '設備は1以上の値にしてください。',
        ],
        'work_style' => [
            'required' => '働き方は必須です',
            'max' => '働き方は5以下の値にしてください。',
            'min' => '働き方は1以上の値にしてください。',
        ],
        'student_balance' => [
            'required' => '人数バランスは必須です',
            'max' => '人数バランスは5以下の値にしてください。',
            'min' => '人数バランスは1以上の値にしてください。',
        ],
    ],

    'attributes' => [
        'nickname' => 'ニックネーム',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'password_confirmation' => 'パスワード（確認用）',
        'name' => '大学名',
        'faculty.name' => '学部名',
        'comment' => '編集理由',
        'description' => '説明',
        'professor_name' => '教授名',
        'url' => 'URL',
        'professor_url' => '教授のURL',
        'reason' => '削除理由',
        'mentorship_style' => '指導スタイル',
        'lab_atmosphere' => '雰囲気・文化',
        'achievement_activity' => '成果・活動',
        'constraint_level' => '拘束度',
        'facility_quality' => '設備',
        'work_style' => '働き方',
        'student_balance' => '人数バランス',
    ],

];
