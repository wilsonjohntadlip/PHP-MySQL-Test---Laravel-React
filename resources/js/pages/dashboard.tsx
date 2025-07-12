import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react'; // Ensure 'router' is imported here
import React, { useState, Fragment } from 'react'; // Ensure 'Fragment' is imported
import { Dialog, Transition } from '@headlessui/react'; // Headless UI imports
import ResultPage from './ResultPage'; // Import the ResultPage component

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // State for the form fields
    const [checkedBox, setCheckedBox] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');
    const [radioInput, setRadioInput] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState({
        text_input: '',
        radio_input: '',
        checkbox_input: '',
    });

    // State for the success modal
    const [showModal, setShowModal] = useState(false);

    // State for the loading modal and button disablement
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For button disabled state

    // State to manage the current view (form or results)
    const [currentView, setCurrentView] = useState<'form' | 'results'>('form');
    // State to store the fetched submission data for ResultPage
    const [fetchedSubmission, setFetchedSubmission] = useState<any | null>(null); // Use 'any' for now, or define a specific interface if needed

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        const newErrors = {
            text_input: '',
            radio_input: '',
            checkbox_input: '',
        };
        let isValid = true;

        if (textInput.trim() === '') {
            newErrors.text_input = 'Text Box cannot be empty.';
            isValid = false;
        }

        if (radioInput === '') {
            newErrors.radio_input = 'Please select a radio option.';
            isValid = false;
        }

        // For checkbox, require at least one to be checked
        if (checkedBox === null) {
            newErrors.checkbox_input = 'Please select a checkbox option.';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            return; // Stop submission if validation fails
        }

        setIsLoading(true);
        setShowLoadingModal(true);

        const data = {
            text_input: textInput,
            radio_input: radioInput,
            checkbox_input: checkedBox,
        };

        try {
            const response = await fetch('/form-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setShowModal(true);
                // Clear form fields on successful submission
                setTextInput('');
                setRadioInput('');
                setCheckedBox(null);
                setErrors({ // Clear errors after successful submission
                    text_input: '',
                    radio_input: '',
                    checkbox_input: '',
                });
            } else {
                const errorData = await response.json();
                alert(`There was an error saving your submission: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('A network error occurred during submission.');
        } finally {
            setIsLoading(false);
            setShowLoadingModal(false);
        }
    };

    // Handles "View Database" button click
    const handleViewDatabase = async () => {
        setIsLoading(true);      // Disable buttons immediately
        setShowLoadingModal(true); // Show loading modal

        try {
            const response = await fetch(route('view.database'));
            const data = await response.json();

            if (response.ok && data.latestSubmission) {
                setFetchedSubmission(data.latestSubmission);
                setCurrentView('results'); // Switch to results view
            } else {
                alert('No submissions found or an error occurred.');
                setFetchedSubmission(null);
                setCurrentView('form'); // Stay on form if no data
            }
        } catch (error) {
            console.error('Fetching data failed:', error);
            alert('A network error occurred while fetching data.');
        } finally {
            setIsLoading(false);      // Re-enable buttons
            setShowLoadingModal(false); // Hide loading modal
        }
    };

    // Callback function passed to ResultPage to switch back to form view
    const handleBackToForm = () => {
        setCurrentView('form'); // Switch back to form view
        setFetchedSubmission(null); // Clear fetched data
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Conditional Rendering: Show Form or Results Page */}
                {currentView === 'form' ? (
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border flex items-center justify-center">
                        <form onSubmit={handleSubmit} className="w-full max-w-lg p-10 rounded-lg shadow border border-gray-600 bg-white">
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2" htmlFor="textbox">
                                    Text Box (100 Characters)
                                </label>
                                <input
                                    id="textbox"
                                    name="textbox"
                                    type="text"
                                    maxLength={100}
                                    className="w-full border border-gray-400 rounded px-3 py-2 text-lg"
                                    value={textInput}
                                    onChange={e => setTextInput(e.target.value)}
                                    // required // Handled by custom validation
                                />
                                {errors.text_input && (
                                    <p className="text-red-500 text-sm mt-1">{errors.text_input}</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <div className="text-gray-700 mb-2">Radio Button</div>
                                <div className="flex flex-col gap-2 ml-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="greeting"
                                            value="Hi" // Changed from 'hi' to 'Hi'
                                            className="size-5"
                                            checked={radioInput === 'Hi'} // Changed from 'hi' to 'Hi'
                                            onChange={() => setRadioInput('Hi')} // Changed from 'hi' to 'Hi'
                                            // required // Handled by custom validation
                                        />
                                        Hi
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="greeting"
                                            value="Hello" // Changed from 'hello' to 'Hello'
                                            className="size-5"
                                            checked={radioInput === 'Hello'} // Changed from 'hello' to 'Hello'
                                            onChange={() => setRadioInput('Hello')} // Changed from 'hello' to 'Hello'
                                            // required // Handled by custom validation
                                        />
                                        Hello
                                    </label>
                                </div>
                                {errors.radio_input && (
                                    <p className="text-red-500 text-sm mt-1">{errors.radio_input}</p>
                                )}
                            </div>
                            <div className="mb-14">
                                <div className="text-gray-700 mb-2">Check Box</div>
                                <div className="flex flex-col gap-2 ml-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="world"
                                            className="size-5"
                                            checked={checkedBox === 'World!'} // Changed from 'world' to 'World!'
                                            onChange={() => setCheckedBox(checkedBox === 'World!' ? null : 'World!')} // Changed from 'world' to 'World!'
                                        />
                                        World!
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="web"
                                            className="size-5"
                                            checked={checkedBox === 'Web!'} // Changed from 'web' to 'Web!'
                                            onChange={() => setCheckedBox(checkedBox === 'Web!' ? null : 'Web!')} // Changed from 'web' to 'Web!'
                                        />
                                        Web!
                                    </label>
                                </div>
                                {errors.checkbox_input && (
                                    <p className="text-red-500 text-sm mt-1">{errors.checkbox_input}</p>
                                )}
                            </div>
                            <div className="flex gap-6 justify-center">
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-gray-500 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-500 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleViewDatabase}
                                    disabled={isLoading}
                                >
                                    View Database
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    // Render ResultPage and pass fetched data and the back-to-form callback
                    <ResultPage latestSubmission={fetchedSubmission} onBackToForm={handleBackToForm} />
                )}
            </div>

            {/* Success Modal (Headless UI) */}
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40" />
                    </Transition.Child>

                    {/* Modal Content */}
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 text-green-600"
                                    >
                                        Success!
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Your data has been successfully saved to the database.
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Loading Modal (Headless UI) */}
            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => { /* Modal not dismissible during loading */ }}>
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40" />
                    </Transition.Child>

                    {/* Modal Content */}
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-6 text-center align-middle shadow-xl transition-all">
                                    <div className="flex flex-col items-center justify-center">
                                        {/* Simple Tailwind Spinner */}
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                                        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AppLayout>
    );
}
