<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faculty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'university_id'
    ];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($faculty) {
            // 論理削除時に関連する研究室も論理削除
            $faculty->labs()->get()->each->delete();
        });
    }

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    // 中間テーブル名を明示的に指定
    public function users()
    {
        return $this->belongsToMany(User::class, 'faculty_edit_histories')->withTimestamps();
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

    // 削除依頼とのポリモーフィックリレーション(一対多)
    public function deletionRequests()
    {
        return $this->morphMany(DeletionRequest::class, 'target');
    }

    // 追加: 作成者とのリレーション（多対一）
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
