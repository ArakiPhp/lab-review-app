<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = [
        'name', 'university_id'
    ];

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    public function users()
    {
        return $this->belongsToMany(User::class, 'faculty_user')->withTimestamps();
    }

    // 大学とのリレーション（多対一）
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    // 研究室とのリレーション（一対多）
    public function labs()
    {
        return $this->hasMany(Lab::class);
    }
}
