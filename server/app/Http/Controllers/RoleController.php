<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        // Exclude super admin role
        $roles = Role::where('code', '!=', 900)->get();
        return response()->json($roles);
    }
}
