<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Document;
use App\Mail\DocumentRouted;

class SendDocumentRoutedEmail implements ShouldQueue
{
    use Queueable;

    public $document;
    public $user;

    /**
     * Create a new job instance.
     */
    public function __construct(Document $document, User $user)
    {
        $this->document = $document;
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->user->email)->send(new DocumentRouted($this->document, $this->user));
    }
}
