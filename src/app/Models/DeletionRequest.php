<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DeletionRequest extends Model
{
    protected $fillable = [
        'requested_by',
        'processed_by',
        'target_id',
        'target_type',
        'status',
        'reason',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    // リレーションの定義
    /**
     * 削除対象モデルとのポリモーフィックリレーション（多対一）
     */
    public function target(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * 依頼者とのリレーション（多対一）
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * 対応する管理者とのリレーション（多対一）
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
