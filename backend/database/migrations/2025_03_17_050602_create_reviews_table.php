<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('tutor_profiles')->onDelete('cascade'); // Link to tutor
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The student/parent giving the review
            $table->integer('rating')->comment('1 to 5 stars');
            $table->text('review')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('reviews');
    }
};
