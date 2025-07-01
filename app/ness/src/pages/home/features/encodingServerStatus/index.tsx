import { useLoaderData } from 'react-router';
import { ServerStatusResponse } from '@/api/models/serverStatus.ts';

const EncodingServerStatus = () => {
    const serverStatusData = useLoaderData() as ServerStatusResponse;

    // console.log('Server Status Data:', serverStatusData);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running':
                return 'bg-green-100 text-green-800';
            case 'stopping':
                return 'bg-yellow-100 text-yellow-800';
            case 'stopped':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Server Status</h1>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-4 text-lg font-medium text-gray-700">
                    Server Instances ({serverStatusData?.data?.length || 0})
                </h2>

                <div className="space-y-4">
                    {serverStatusData?.data?.map((server) => (
                        <div key={server.instanceId} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-3 flex items-start justify-between">
                                <h3 className="flex-1 font-medium text-gray-800">{server.instanceName}</h3>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(server.status)}`}
                                >
                                    {server.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                <div>
                                    <span className="font-medium text-gray-600">Instance ID:</span>
                                    <div className="mt-1 rounded bg-gray-100 p-2 font-mono text-xs">
                                        {server.instanceId}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Server Type:</span>
                                    <span className="ml-2 text-gray-800">{server.serverType}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Created At:</span>
                                    <span className="ml-2 text-gray-800">{server.createdAt}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Updated At:</span>
                                    <span className="ml-2 text-gray-800">{server.updatedAt}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EncodingServerStatus;
