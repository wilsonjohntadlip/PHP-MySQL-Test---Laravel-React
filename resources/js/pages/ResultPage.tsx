import { Head } from '@inertiajs/react'; // Only Head is typically needed here now

// Define the type for the submission data
interface Submission {
    id: number;
    text_input: string;
    radio_input: string;
    checkbox_input: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
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
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border flex flex-col items-center justify-center p-4">
            <Head title="Database View" />

            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md mb-[100px] w-full max-w-lg text-center">
                {latestSubmission ? latestSubmission.text_input : 'No Text Input Available'}
            </div>
            
            <h1 className="text-3xl font-semibold mb-4">{helloText} {worldText}</h1>

            <div className="mt-16">
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

