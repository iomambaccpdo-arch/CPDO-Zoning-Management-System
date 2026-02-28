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

    Route::get('roles', [RoleController::class, 'index'])->middleware('permission:accounts,view');
});
