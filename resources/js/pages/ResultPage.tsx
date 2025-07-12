import { Head } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';

// Define the type for the submission data
interface Submission {
    id: number;
    text_input: string;
    radio_input: string;
    checkbox_input: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
    image_path: string | null; // Added image_path to the interface
}

// Define the props for ResultPage, including the new onBackToForm callback
interface ResultPageProps {
    latestSubmission: Submission | null;
    onBackToForm: () => void; // This is the callback from the parent
}

export default function ResultPage({ latestSubmission, onBackToForm }: ResultPageProps) {
    // This function now simply calls the prop received from the parent
    const handleBackToForm = () => {
        onBackToForm();
    };

    // Get dynamic values for Hello and World
    const helloText = latestSubmission?.radio_input || 'Hello';
    const worldText = latestSubmission?.checkbox_input || 'World!'; // Default to 'World!' if checkbox is null

    return (
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border flex flex-col items-center justify-center">
            <Head title="Database View" />

            {/* Top Green Box - Adjusted margin to move it significantly up and added more bottom margin */}
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md mb-8 w-full max-w-lg text-center">
                {latestSubmission ? latestSubmission.text_input : 'No Text Input Available'}
            </div>
            <h1 className="text-3xl font-semibold mb-8 mt-4">{helloText} {worldText}</h1>

            {latestSubmission?.image_path && (
                <div className="mb-12 w-full max-w-lg flex justify-center">
                    <img
                        src={latestSubmission.image_path}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                    />
                </div>
            )}

            <div className="mt-8"> {/* Adjusted mt-8 */}
                <button
                    onClick={handleBackToForm}
                    className="px-6 py-2 border border-gray-500 rounded bg-gray-200 hover:bg-gray-300 text-lg"
                >
                    Back to Form
                </button>
            </div>
        </div>
    );
}

