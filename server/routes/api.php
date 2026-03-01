<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);

    // Accounts Management
    Route::apiResource('users', UserController::class)->middleware('permission:accounts,view');
    Route::post('users/{user}', [UserController::class, 'update'])->middleware('permission:accounts,edit'); // For multipart/form-data if needed, but here we use json
    
    // Profile Management
    Route::put('/profile', [ProfileController::class, 'update']);

    // Dashboard
    Route::get('dashboard', [\App\Http\Controllers\DocumentController::class, 'dashboard']);

    // Documents
    Route::get('documents/next-application-no', [\App\Http\Controllers\DocumentController::class, 'getNextApplicationNo']);
    Route::get('documents', [\App\Http\Controllers\DocumentController::class, 'index']);
    Route::post('documents', [\App\Http\Controllers\DocumentController::class, 'store']);
    Route::post('documents/{document}', [\App\Http\Controllers\DocumentController::class, 'update']);
    Route::delete('documents/{document}', [\App\Http\Controllers\DocumentController::class, 'destroy']);

    Route::get('roles', [RoleController::class, 'index'])->middleware('permission:accounts,view');
    Route::get('zonings', [\App\Http\Controllers\ZoningController::class, 'index']);
    Route::get('barangays', [\App\Http\Controllers\BarangayController::class, 'index']);
});
