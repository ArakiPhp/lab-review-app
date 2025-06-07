<?php

namespace App\Models;

use Illuminate\Container\Attributes\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'lab_id',
        'mentorship_style',
        'lab_atmosphere',
        'achievement_activity',
        'constraint_level',
        'facility_quality',
        'work_style',
        'student_balance',
    ];

    // リレーションシップの定義
    // ユーザーとのリレーション（多対一）
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 研究室とのリレーション（多対一）
    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }
}
