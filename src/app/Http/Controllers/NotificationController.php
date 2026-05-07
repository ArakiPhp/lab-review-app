<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $notifications = $user->notifications()->latest()->get();
        
        return Inertia::render('Notification/Index', [
            'user' => $user,
            'notifications' => $notifications,
        ]);
    }

    /**
     * 未読通知をすべて既読にする
     */
    public function markAsRead(): RedirectResponse
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();

        return back();
    }
}
