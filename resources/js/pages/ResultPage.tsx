import { Head } from '@inertiajs/react';
import React from 'react';
import { Submission, EmojiData } from '@/types'; // <--- NEW: Import Submission and EmojiData

// REMOVED: interface Submission { ... }
// REMOVED: interface EmojiData { ... }

// Define the props for ResultPage, including the new onBackToForm callback and randomEmojiData
interface ResultPageProps {
    latestSubmission: Submission | null;
    onBackToForm: () => void;
    randomEmojiData: EmojiData | null;
}

export default function ResultPage({ latestSubmission, onBackToForm, randomEmojiData }: ResultPageProps) {
    // This function now simply calls the prop received from the parent
    const handleBackToForm = () => {
        onBackToForm();
    };

    // Get dynamic values for Hello and World
    const helloText = latestSubmission?.radio_input || 'Hello';
    const worldText = latestSubmission?.checkbox_input || 'World!'; // Default to 'World!' if checkbox is null

    return (
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border flex flex-col items-center justify-center p-8">
            <Head title="Database View" />

            {/* Top Green Box - Adjusted margin to move it significantly up and added more bottom margin */}
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md mb-8 w-full max-w-lg text-center">
                {latestSubmission ? latestSubmission.text_input : 'No Text Input Available'}
            </div>

            <h1 className="text-3xl font-semibold mb-8">{helloText} {worldText}</h1>

            {latestSubmission?.image_path && (
                <div className="mb-16 w-full max-w-lg flex justify-center">
                    <img
                        src={latestSubmission.image_path}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                    />
                </div>
            )}

            {/* Additional Data from 3rd Party API Table */}
            {randomEmojiData && (
                <div className="relative w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* Updated table headers to directly reflect Emojihub API fields */}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HTML Code</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unicode</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    {/* Displaying all available API data directly */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{randomEmojiData.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{randomEmojiData.category || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{randomEmojiData.group || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{randomEmojiData.htmlCode?.join(', ') || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{randomEmojiData.unicode?.join(', ') || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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

