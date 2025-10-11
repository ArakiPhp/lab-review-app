<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ModelChangedNotification extends Notification
{
    use Queueable;

    protected $action; // 'edited' or 'deleted'
    protected $modelType; // '大学', '学部', '研究室'
    protected $modelName; // 対象の名前
    protected $changes;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $action, string $modelType, string $modelName, ?array $changes = null)
    {
        $this->action = $action;
        $this->modelType = $modelType;
        $this->modelName = $modelName;
        $this->changes = $changes;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $message = match($this->action) {
            'edited' => "あなたが作成した「{$this->modelName}（{$this->modelType}）」が編集されました。",
            'deleted' => "あなたが作成した「{$this->modelName}（{$this->modelType}）」が削除されました。",
            default => "あなたが作成した「{$this->modelName}（{$this->modelType}）」に変更がありました。",
        };

        return [
            'message' => $message,
            'action' => $this->action,
            'model_type' => $this->modelType,
            'model_name' => $this->modelName,
            'changes' => $this->changes,
        ];
    }
}
