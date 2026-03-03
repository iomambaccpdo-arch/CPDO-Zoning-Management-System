<?php

namespace App\Support;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Record an activity.
     *
     * @param  string       $action      e.g. 'login', 'logout', 'create', 'update', 'delete'
     * @param  string       $module      e.g. 'documents', 'files', 'accounts', 'auth'
     * @param  string|null  $record      Short label of the affected record (e.g. application no or filename)
     * @param  string|null  $description Longer human-readable description
     */
    public static function log(
        string $action,
        string $module,
        ?string $record = null,
        ?string $description = null
    ): void {
        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => $action,
            'module'     => $module,
            'record'     => $record,
            'description'=> $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
