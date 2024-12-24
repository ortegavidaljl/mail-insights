<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    use HasUuids;

    public function comments(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    protected $fillable = [
        'account_id',
        'general',
        'spamassassin',
        'authentication',
        'rbl'
    ];
}
