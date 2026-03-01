<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BarangayController extends Controller
{
    public function index()
    {
        $barangays = \App\Models\Barangay::with('puroks')->get();
        return response()->json($barangays);
    }
}
