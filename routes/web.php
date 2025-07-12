<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormSubmissionController;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/form-submit', [FormSubmissionController::class, 'store']);
    Route::get('/view-database', [FormSubmissionController::class, 'showLatest'])->name('view.database');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
