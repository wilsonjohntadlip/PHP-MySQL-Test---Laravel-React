<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dbuser1Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// Remove: use Inertia\Inertia; // No longer needed for showLatest


class FormSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text_input' => 'required|string|max:100',
            'radio_input' => 'required|string',
            'checkbox_input' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        Dbuser1Submission::create($validated);

        return response()->json(['success' => true]);
    }

    public function showLatest()
    {
        // Get the authenticated user's latest submission
        $latestSubmission = Dbuser1Submission::where('user_id', Auth::id())
                                            ->latest() // Order by latest created_at
                                            ->first(); // Get only the first (latest) one

        // Return JSON response instead of Inertia render
        return response()->json([
            'latestSubmission' => $latestSubmission,
        ]);
    }
}
