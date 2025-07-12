<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Dbuser1Submission extends Model
{
    use HasFactory;

    // Specify the table name as it deviates from Laravel's naming convention (pluralized model name)
    protected $table = 'dbuser1_submissions';

    // The attributes that are mass assignable.
    protected $fillable = [
        'user_id',
        'text_input',
        'radio_input',
        'checkbox_input',
    ];

    /**
     * Get the user that owns the submission.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
