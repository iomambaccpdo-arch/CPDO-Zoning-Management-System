<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Document;
use App\Models\DocumentAttachment;
use App\Models\User;
use App\Jobs\SendDocumentRoutedEmail;
use Carbon\Carbon;

class DocumentController extends Controller
{
    // ---------------------------------------------------------------
    // Dashboard: monthly document counts + recent file attachments
    // ---------------------------------------------------------------
    public function dashboard(Request $request)
    {
        $year = (int) $request->query('year', Carbon::now()->year);

        // Count documents per month for the given year (PostgreSQL-compatible)
        $rows = Document::selectRaw('EXTRACT(MONTH FROM created_at)::integer as month, COUNT(*) as count')
            ->whereYear('created_at', $year)
            ->groupByRaw('EXTRACT(MONTH FROM created_at)')
            ->get()
            ->keyBy('month');

        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[] = [
                'month'      => $m,
                'month_name' => Carbon::create($year, $m, 1)->format('F'),
                'count'      => isset($rows[$m]) ? (int) $rows[$m]->count : 0,
            ];
        }

        // 10 most-recent attachments across all documents
        $recentAttachments = DocumentAttachment::with('document:id,document_title')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'document_id', 'file_name', 'file_type', 'file_size', 'created_at']);

        return response()->json([
            'monthly_counts'     => $months,
            'recent_attachments' => $recentAttachments,
        ]);
    }

    public function getNextApplicationNo(Request $request)
    {
        // $documentTitle = $request->query('documentTitle', '');
        
        $prefix = 'LC';
        // if ($documentTitle === 'Zoning Clearance') {
        //     $prefix = 'ZC';
        // } elseif ($documentTitle === 'Development Permit') {
        //     $prefix = 'DP';
        // }

        $currentYear = Carbon::now()->year;
        
        $searchPrefix = "{$prefix}-{$currentYear}-";
        
        $latestDocument = Document::where('zoning_application_no', 'like', $searchPrefix . '%')
            ->orderBy('zoning_application_no', 'desc')
            ->first();
            
        if (!$latestDocument) {
            return response()->json(['applicationNo' => current([$searchPrefix . '0001'])]);
        }
        
        $lastNumber = intval(substr($latestDocument->zoning_application_no, -4));
        $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        
        return response()->json(['applicationNo' => $searchPrefix . $nextNumber]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'documentTitle' => 'required|string',
            'zoning' => 'required|exists:zonings,id',
            'zoningApplicationNo' => 'required|string',
            'typeOfProject' => 'required|exists:project_types,id',
            'dateOfApplication' => 'required|date',
            'dueDate' => 'nullable|string',
            'applicantName' => 'required|string',
            'receivedBy' => 'required|string',
            'assistedBy' => 'nullable|string',
            'oic' => 'required|string',
            'barangay' => 'required|exists:barangays,id',
            'purok' => 'required|exists:puroks,id',
            'landmark' => 'required|string',
            'coordinates' => 'nullable|string',
            'floorArea' => 'required|string',
            'lotArea' => 'required|string',
            'storey' => 'required|string',
            'mezanine' => 'nullable|string',
            'routedTo' => 'required|array',
            'routedTo.*' => 'exists:users,id',
            'files' => 'nullable|array',
            'files.*' => 'file',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create the Document
            $document = Document::create([
                'document_title' => $validatedData['documentTitle'],
                'zoning_id' => $validatedData['zoning'],
                'zoning_application_no' => $validatedData['zoningApplicationNo'],
                'project_type_id' => $validatedData['typeOfProject'],
                'date_of_application' => Carbon::parse($validatedData['dateOfApplication'])->format('Y-m-d'),
                'due_date' => $validatedData['dueDate'] ? Carbon::parse($validatedData['dueDate'])->format('Y-m-d') : null, // Assuming the frontend sends a string date we might need to parse, or null
                'applicant_name' => $validatedData['applicantName'],
                'received_by' => $validatedData['receivedBy'],
                'assisted_by' => $validatedData['assistedBy'] ?? null,
                'oic' => $validatedData['oic'],
                'barangay_id' => $validatedData['barangay'],
                'purok_id' => $validatedData['purok'],
                'landmark' => $validatedData['landmark'],
                'coordinates' => $validatedData['coordinates'] ?? null,
                'floor_area' => $validatedData['floorArea'],
                'lot_area' => $validatedData['lotArea'],
                'storey' => $validatedData['storey'],
                'mezanine' => $validatedData['mezanine'] ?? null,
            ]);

            // 2. Attach routes (Users)
            if (!empty($validatedData['routedTo'])) {
                $document->routedToUsers()->attach($validatedData['routedTo']);
            }

            // 3. Process File Uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $originalName = $file->getClientOriginalName();
                    
                    // Note: easily swappable to 's3' later when needed
                    // Using 'private' disk implies it might go to storage/app/private/documents/..
                    // We'll use 'local' disk and a private path for now.
                    $path = $file->store("documents/{$document->id}", 'local');
                    
                    $document->attachments()->create([
                        'file_path' => $path,
                        'file_name' => $originalName,
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            DB::commit();

            // 4. Dispatch Email Jobs
            if (!empty($validatedData['routedTo'])) {
                $routedUsers = User::whereIn('id', $validatedData['routedTo'])->get();
                foreach ($routedUsers as $user) {
                    SendDocumentRoutedEmail::dispatch($document, $user);
                }
            }

            return response()->json([
                'message' => 'Document created successfully.',
                'document' => $document->load(['attachments', 'routedToUsers'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create document.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $search  = $request->query('search', '');
        $year    = $request->query('year');
        $month   = $request->query('month');

        $query = Document::with(['zoning', 'projectType', 'barangay', 'purok', 'routedToUsers', 'attachments'])
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('document_title', 'like', "%{$search}%")
                  ->orWhere('applicant_name', 'like', "%{$search}%")
                  ->orWhere('zoning_application_no', 'like', "%{$search}%");
            });
        }

        if ($year)  { $query->whereYear('created_at', (int) $year); }
        if ($month) { $query->whereMonth('created_at', (int) $month); }

        return response()->json($query->paginate($perPage));
    }

    public function update(Request $request, Document $document)
    {
        $validatedData = $request->validate([
            'documentTitle'     => 'required|string',
            'zoning'            => 'required|exists:zonings,id',
            'zoningApplicationNo' => 'required|string',
            'typeOfProject'     => 'required|exists:project_types,id',
            'dateOfApplication' => 'required|date',
            'dueDate'           => 'nullable|string',
            'applicantName'     => 'required|string',
            'receivedBy'        => 'required|string',
            'assistedBy'        => 'nullable|string',
            'oic'               => 'required|string',
            'barangay'          => 'required|exists:barangays,id',
            'purok'             => 'required|exists:puroks,id',
            'landmark'          => 'required|string',
            'coordinates'       => 'nullable|string',
            'floorArea'         => 'required|string',
            'lotArea'           => 'required|string',
            'storey'            => 'required|string',
            'mezanine'          => 'nullable|string',
            'routedTo'          => 'required|array',
            'routedTo.*'        => 'exists:users,id',
            'files'             => 'nullable|array',
            'files.*'           => 'file',
        ]);

        try {
            DB::beginTransaction();

            $document->update([
                'document_title'      => $validatedData['documentTitle'],
                'zoning_id'           => $validatedData['zoning'],
                'zoning_application_no' => $validatedData['zoningApplicationNo'],
                'project_type_id'     => $validatedData['typeOfProject'],
                'date_of_application' => Carbon::parse($validatedData['dateOfApplication'])->format('Y-m-d'),
                'due_date'            => isset($validatedData['dueDate']) ? Carbon::parse($validatedData['dueDate'])->format('Y-m-d') : null,
                'applicant_name'      => $validatedData['applicantName'],
                'received_by'         => $validatedData['receivedBy'],
                'assisted_by'         => $validatedData['assistedBy'] ?? null,
                'oic'                 => $validatedData['oic'],
                'barangay_id'         => $validatedData['barangay'],
                'purok_id'            => $validatedData['purok'],
                'landmark'            => $validatedData['landmark'],
                'coordinates'         => $validatedData['coordinates'] ?? null,
                'floor_area'          => $validatedData['floorArea'],
                'lot_area'            => $validatedData['lotArea'],
                'storey'              => $validatedData['storey'],
                'mezanine'            => $validatedData['mezanine'] ?? null,
            ]);

            // Sync routedTo users
            $document->routedToUsers()->sync($validatedData['routedTo']);

            // Append new file uploads (keep existing attachments)
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store("documents/{$document->id}", 'local');
                    $document->attachments()->create([
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message'  => 'Document updated successfully.',
                'document' => $document->load(['zoning', 'projectType', 'barangay', 'purok', 'routedToUsers', 'attachments']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update document.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Document $document)
    {
        try {
            // Delete stored files from disk
            foreach ($document->attachments as $attachment) {
                Storage::disk('local')->delete($attachment->file_path);
            }
            $document->delete();
            return response()->json(['message' => 'Document deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete document.', 'error' => $e->getMessage()], 500);
        }
    }
}
