<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    /**
     * GET /api/activity-logs
     * Paginated list of all activity log entries, newest first.
     * Supports filters: search, action, module, date_from, date_to
     */
    public function index(Request $request)
    {
        $perPage  = $request->query('per_page', 20);
        $search   = $request->query('search', '');
        $action   = $request->query('action', '');
        $module   = $request->query('module', '');
        $dateFrom = $request->query('date_from', '');
        $dateTo   = $request->query('date_to', '');

        $query = ActivityLog::with('user:id,first_name,last_name,email')
            // Exclude actions performed by Super Admin (role code 900)
            ->whereDoesntHave('user.roles', function ($q) {
                $q->where('code', 900);
            })
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('record', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('first_name', 'like', "%{$search}%")
                         ->orWhere('last_name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($action) {
            $query->where('action', $action);
        }

        if ($module) {
            $query->where('module', $module);
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return response()->json($query->paginate($perPage));
    }
}
