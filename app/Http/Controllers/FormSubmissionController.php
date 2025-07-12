<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dbuser1Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


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

    // New method to fetch a random emoji from the 3rd party API
    public function fetchRandomEmoji()
    {
        Log::info('fetchRandomEmoji method called.'); // Log start of method

        try {
            $response = Http::get('https://emojihub.yurace.pro/api/all');

            Log::info('Emoji API response status: ' . $response->status()); // Log API response status
            Log::info('Emoji API response body: ' . $response->body());   // Log full response body

            if ($response->successful()) {
                $emojis = $response->json();

                if (!empty($emojis)) {
                    // Select a random emoji from the array
                    $randomEmoji = $emojis[array_rand($emojis)];
                    Log::info('Random emoji selected: ' . json_encode($randomEmoji)); // Log selected emoji
                    return response()->json($randomEmoji);
                } else {
                    Log::warning('No emojis found from API. Response was empty.'); // Log if response is empty
                    return response()->json(['message' => 'No emojis found from API.'], 404);
                }
            } else {
                Log::error('Failed to fetch emojis from API. Status: ' . $response->status() . ' Body: ' . $response->body()); // Log API failure
                return response()->json(['message' => 'Failed to fetch emojis from API.', 'status' => $response->status()], $response->status());
            }
        } catch (\Exception $e) {
            Log::error('An error occurred while fetching emoji: ' . $e->getMessage() . ' - ' . $e->getFile() . ':' . $e->getLine()); // Log any exceptions
            return response()->json(['message' => 'An error occurred while fetching emoji: ' . $e->getMessage()], 500);
        }
    }
}
