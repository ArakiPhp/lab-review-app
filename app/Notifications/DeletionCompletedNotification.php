<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeletionCompletedNotification extends Notification
{
    use Queueable;

    protected $targetName;
    protected $targetType;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $targetName, string $targetType)
    {
        $this->targetName = $targetName;
        $this->targetType = $targetType;
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
        return [
            'message' => "あなたが削除依頼した「{$this->targetName}（{$this->targetType}）」は管理者によって削除されました。",
        ];
    }
}
