<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lab extends Model
{
    protected $fillable = [
        'name',
        'faculty_id',
    ];

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    // 修正: 中間テーブル名を明示的に指定
    public function users()
    {
        return $this->belongsToMany(User::class, 'lab_edit_histories')->withTimestamps();
    }

    // 学部とのリレーション（多対一）
    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    // レビューとのリレーション（一対多）
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
