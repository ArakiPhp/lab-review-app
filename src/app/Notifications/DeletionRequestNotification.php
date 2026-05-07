<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeletionRequestNotification extends Notification
{
    use Queueable;

    protected $targetName;
    protected $targetType;
    protected $targetId;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $targetName, string $targetType, int $targetId)
    {
        $this->targetName = $targetName;
        $this->targetType = $targetType;
        $this->targetId = $targetId;
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
            'message'     => "「{$this->targetName}」に削除依頼が届きました。",
            'target_type' => $this->targetType,
            'target_id'   => $this->targetId,
        ];
    }
}
