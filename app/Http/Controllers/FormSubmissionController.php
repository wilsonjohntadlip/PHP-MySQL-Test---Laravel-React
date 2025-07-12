<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dbuser1Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class FormSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text_input' => 'required|string|max:100',
            'radio_input' => 'required|string',
            'checkbox_input' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,gif|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            // Store the image in the 'images' directory on the 'public' disk
            // This will create a file in storage/app/public/images
            $imagePath = $request->file('image_file')->store('images', 'public'); // <--- CHANGED THIS LINE

            // Get the public URL for the stored image
            // This path will be stored in the database
            $imagePath = Storage::url($imagePath);
        }

        $validated['user_id'] = $request->user()->id;
        $validated['image_path'] = $imagePath; // Add the image path to validated data

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
