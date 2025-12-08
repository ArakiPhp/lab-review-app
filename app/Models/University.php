<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class University extends Model
{
    use SoftDeletes; // 論理削除

    protected $fillable = [
        'name',
        'type',
    ];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($university) {
            // 論理削除時に関連する学部も論理削除
            $university->faculties()->get()->each->delete();
        });
    }

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    // 中間テーブル名を明示的に指定
    public function users()
    {
        return $this->belongsToMany(User::class, 'university_edit_histories')->withTimestamps();
    }

    // 学部とのリレーション（一対多）
    public function faculties()
    {
        return $this->hasMany(Faculty::class);
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
