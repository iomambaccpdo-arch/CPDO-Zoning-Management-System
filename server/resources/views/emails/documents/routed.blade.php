<x-mail::message>
# Hello {{ $user->first_name }},

A new document has been routed to you in the CPDO Zoning Management System.

**Document Details:**
- **Title:** {{ $document->document_title }}
- **Application No:** {{ $document->zoning_application_no }}
- **Project Type:** {{ $document->projectType->name ?? 'N/A' }}
- **Date of Application:** {{ \Carbon\Carbon::parse($document->date_of_application)->format('M d, Y') }}
- **Due Date:** {{ \Carbon\Carbon::parse($document->due_date)->format('M d, Y') }}

<x-mail::button :url="config('app.url') . '/files'">
View Documents
</x-mail::button>

Thanks,<br>
CPDO Team
</x-mail::message>
