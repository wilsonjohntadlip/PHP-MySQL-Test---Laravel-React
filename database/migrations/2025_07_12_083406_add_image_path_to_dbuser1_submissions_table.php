<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('dbuser1_submissions', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('checkbox_input');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dbuser1_submissions', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
