<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zoning extends Model
{
    protected $fillable = ['name'];

    public function projectTypes()
    {
        return $this->hasMany(ProjectType::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
