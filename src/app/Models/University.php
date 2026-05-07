<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class University extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
    ];

    /**
     * 論理削除時に関連する学部も論理削除するように設定
     */
    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function ($university) {
            // 論理削除時に関連する学部も論理削除
            $university->faculties()->get()->each->delete();
        });
    }

    // リレーションの定義
    /**
     * ユーザーとのリレーション（多対多）
     * 
     * 中間テーブル名を明示的に指定
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'university_edit_histories')->withTimestamps();
    }

    /**
     * 学部とのリレーション（一対多）
     */
    public function faculties(): HasMany
    {
        return $this->hasMany(Faculty::class);
    }

    /**
     * 削除依頼とのポリモーフィックリレーション(一対多)
     */
    public function deletionRequests(): MorphMany
    {
        return $this->morphMany(DeletionRequest::class, 'target');
    }

    /**
     * 作成者とのリレーション（多対一）
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
