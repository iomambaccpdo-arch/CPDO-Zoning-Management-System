<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ZoningController extends Controller
{
    public function index()
    {
        $zonings = \App\Models\Zoning::with('projectTypes')->get();
        return response()->json($zonings);
    }
}
