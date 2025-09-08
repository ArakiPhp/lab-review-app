<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // 追加: 論理削除

class Lab extends Model
{
    use SoftDeletes; // 追加: 論理削除

    protected $fillable = [
        'name',
        'faculty_id',
    ];

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    // 中間テーブル名を明示的に指定
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

    // コメントとのリレーション（一対多）
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // ブックマークとのリレーション（一対多）
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }
}
