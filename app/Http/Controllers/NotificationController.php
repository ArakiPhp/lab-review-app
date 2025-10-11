<?php

namespace App\Http\Controllers;

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
}
