<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $fillable = ['name'];

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    // 学部とのリレーション（一対多）
    public function faculties()
    {
        return $this->hasMany(Faculty::class);
    }
}
