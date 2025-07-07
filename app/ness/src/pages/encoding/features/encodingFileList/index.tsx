import { useState } from 'react';
import { useLoaderData } from 'react-router';
import {
    FileListResponse,
    getFileList,
    getDefaultDateRangeForInput,
    parseDateFromInput,
} from '@/api/models/fileList.ts';
import { getUserId } from '@/utils';

const EncodingFileList = () => {
    const initialData = useLoaderData() as FileListResponse;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getDefaultDateRangeForInput().startDate);
    const [endDate, setEndDate] = useState(getDefaultDateRangeForInput().endDate);

    // console.log('Encoding File List Data:', data);

    const handleApply = async () => {
        setLoading(true);
        try {
            const userId = getUserId();
            const newData = await getFileList({
                uploadUserId: userId,
                startDate: parseDateFromInput(startDate),
                endDate: parseDateFromInput(endDate),
            });
            setData(newData);
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Encoding File List</h1>

            {/* Date Filter Section */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-700">Date Filter</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <div className="mt-1 text-xs text-gray-500">API: {parseDateFromInput(startDate)}</div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <div className="mt-1 text-xs text-gray-500">API: {parseDateFromInput(endDate)}</div>
                    </div>
                    <div>
                        <button
                            onClick={handleApply}
                            disabled={loading}
                            className="rounded-md bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {loading ? 'Loading...' : 'Apply'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            {data?.data?.statistics && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                    <h2 className="mb-4 text-lg font-medium text-gray-700">Statistics</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{data.data.statistics.total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{data.data.statistics.pending}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{data.data.statistics.running}</div>
                            <div className="text-sm text-gray-600">Running</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{data.data.statistics.completed}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{data.data.statistics.stopped}</div>
                            <div className="text-sm text-gray-600">Stopped</div>
                        </div>
                    </div>
                </div>
            )}

            {/* File List Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-700">
                    Files ({data?.data?.encodingFileList?.length || 0})
                </h2>
                <div className="space-y-4">
                    {data?.data?.encodingFileList?.map((file, index) => (
                        <div key={file.programId} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-3 flex items-start justify-between">
                                <h3 className="flex-1 font-medium text-gray-800">
                                    {file.programTitle || `Program ${index + 1}`}
                                </h3>
                                <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                                    {file.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                <div>
                                    <span className="font-medium text-gray-600">Program ID:</span>
                                    <div className="mt-1 rounded bg-gray-100 p-2 font-mono text-xs">
                                        {file.programId}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Type:</span>
                                    <span className="ml-2 text-gray-800">{file.type.toUpperCase()}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Duration:</span>
                                    <span className="ml-2 text-gray-800">{formatDuration(file.duration)}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Started At:</span>
                                    <span className="ml-2 text-gray-800">{file.startedAt}</span>
                                </div>
                                {file.finishedAt && (
                                    <>
                                        <div>
                                            <span className="font-medium text-gray-600">Finished At:</span>
                                            <span className="ml-2 text-gray-800">{file.finishedAt}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Total Time:</span>
                                            <span className="ml-2 text-gray-800">
                                                {file.totalTimeSpent ? formatDuration(file.totalTimeSpent) : 'N/A'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {file.notes && (
                                <div className="mt-3">
                                    <span className="font-medium text-gray-600">Notes:</span>
                                    <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs text-gray-700">
                                        {file.notes}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EncodingFileList;
