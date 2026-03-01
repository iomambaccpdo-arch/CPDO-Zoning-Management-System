<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'document_title',
        'zoning_id',
        'zoning_application_no',
        'project_type_id',
        'date_of_application',
        'due_date',
        'applicant_name',
        'received_by',
        'assisted_by',
        'oic',
        'barangay_id',
        'purok_id',
        'landmark',
        'coordinates',
        'floor_area',
        'lot_area',
        'storey',
        'mezanine',
    ];

    public function zoning()
    {
        return $this->belongsTo(Zoning::class);
    }

    public function projectType()
    {
        return $this->belongsTo(ProjectType::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function purok()
    {
        return $this->belongsTo(Purok::class);
    }

    public function routedToUsers()
    {
        return $this->belongsToMany(User::class, 'document_routes', 'document_id', 'user_id')->withTimestamps();
    }

    public function attachments()
    {
        return $this->hasMany(DocumentAttachment::class);
    }
}
