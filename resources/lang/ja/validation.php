<?php

return [

    'max' => [
        'numeric' => ':attribute は :max 以下の値にしてください。',
        'file'    => ':attribute は :max KB以下のファイルにしてください。',
        'string'  => ':attribute は :max 文字以下にしてください。',
        'array'   => ':attribute は :max 個以下にしてください。',
    ],

    'custom' => [
        'mentorship_style' => [
            'max' => '指導スタイルは5以下の値にしてください。',
            'min' => '指導スタイルは1以上の値にしてください。',
        ],
        'lab_atmosphere' => [
            'max' => '雰囲気・文化は5以下の値にしてください。',
            'min' => '雰囲気・文化は1以上の値にしてください。',
        ],
        'achievement_activity' => [
            'max' => '成果・活動は5以下の値にしてください。',
            'min' => '成果・活動は1以上の値にしてください。',
        ],
        'constraint_level' => [
            'max' => '拘束度は5以下の値にしてください。',
            'min' => '拘束度は1以上の値にしてください。',
        ],
        'facility_quality' => [
            'max' => '設備は5以下の値にしてください。',
            'min' => '設備は1以上の値にしてください。',
        ],
        'work_style' => [
            'max' => '働き方は5以下の値にしてください。',
            'min' => '働き方は1以上の値にしてください。',
        ],
        'student_balance' => [
            'max' => '人数バランスは5以下の値にしてください。',
            'min' => '人数バランスは1以上の値にしてください。',
        ],
    ],

    'attributes' => [
        'mentorship_style' => '指導スタイル',
        'lab_atmosphere' => '雰囲気・文化',
        'achievement_activity' => '成果・活動',
        'constraint_level' => '拘束度',
        'facility_quality' => '設備',
        'work_style' => '働き方',
        'student_balance' => '人数バランス',
    ],

    'custom' => [
        'name' => [
            'unique' => 'この大学名は既に作成されています。',
            'required' => '大学名は必須項目です。',
            'max' => '大学名は50文字以下にしてください。',
        ],
    ],

];
