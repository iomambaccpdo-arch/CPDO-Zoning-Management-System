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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_title');
            $table->foreignId('zoning_id')->constrained('zonings')->onDelete('cascade');
            $table->string('zoning_application_no');
            $table->foreignId('project_type_id')->constrained('project_types')->onDelete('cascade');
            $table->date('date_of_application');
            $table->date('due_date')->nullable();
            
            $table->string('applicant_name');
            $table->string('received_by');
            $table->string('assisted_by')->nullable();
            $table->string('oic');
            
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('purok_id')->constrained('puroks')->onDelete('cascade');
            $table->string('landmark');
            $table->string('coordinates')->nullable();
            
            $table->string('floor_area');
            $table->string('lot_area');
            $table->string('storey');
            $table->string('mezanine')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
