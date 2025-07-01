import { useLoaderData } from 'react-router';
import { PresetResponse } from '@/api/models/preset.ts';

const EncodingPresetList = () => {
    const presetData = useLoaderData() as PresetResponse;

    // console.log('Preset List Data:', presetData);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Preset List</h1>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-700">Presets ({presetData?.data?.length || 0})</h2>

                <div className="space-y-6">
                    {presetData?.data?.map((preset) => (
                        <div key={preset.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-3 flex items-start justify-between">
                                <h3 className="font-medium text-gray-800">
                                    ID: {preset.id} - {preset.name}
                                </h3>
                                <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                                    {preset.type.toUpperCase()}
                                </span>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                <div>
                                    <span className="font-medium text-gray-600">User Group:</span>
                                    <span className="ml-2 text-gray-800">{preset.userGroup}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Company:</span>
                                    <span className="ml-2 text-gray-800">{preset.companyName}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Created At:</span>
                                    <span className="ml-2 text-gray-800">{preset.createdAt}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Updated At:</span>
                                    <span className="ml-2 text-gray-800">{preset.updatedAt}</span>
                                </div>
                            </div>

                            {preset.notes && (
                                <div className="mb-4">
                                    <span className="font-medium text-gray-600">Notes:</span>
                                    <span className="ml-2 text-gray-800">{preset.notes}</span>
                                </div>
                            )}

                            {preset.options && (
                                <div className="mb-4">
                                    <span className="font-medium text-gray-600">Options:</span>
                                    <pre className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs">
                                        {JSON.stringify(preset.options, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div>
                                <span className="font-medium text-gray-600">FFmpeg Command:</span>
                                <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all rounded bg-gray-100 p-3 text-xs">
                                    {preset.ffmpegCommand}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EncodingPresetList;
