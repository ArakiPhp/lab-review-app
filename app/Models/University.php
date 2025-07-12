<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $fillable = ['name'];

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    // 修正: 中間テーブル名を明示的に指定
    public function users()
    {
        return $this->belongsToMany(User::class, 'university_edit_histories')->withTimestamps();
    }

    // 学部とのリレーション（一対多）
    public function faculties()
    {
        return $this->hasMany(Faculty::class);
    }
}
