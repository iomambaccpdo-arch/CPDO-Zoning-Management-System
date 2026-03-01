<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentAttachment extends Model
{
    protected $fillable = [
        'document_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
