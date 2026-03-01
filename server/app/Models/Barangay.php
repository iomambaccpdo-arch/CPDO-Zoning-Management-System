<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    protected $fillable = ['name'];

    public function puroks()
    {
        return $this->hasMany(Purok::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
