<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purok extends Model
{
    protected $fillable = ['barangay_id', 'name'];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
