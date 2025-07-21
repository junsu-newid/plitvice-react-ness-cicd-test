import { useCallback, useEffect, useRef, useState } from 'react';
import mediaInfoFactory, { MediaInfo } from 'mediainfo.js';
import type { MediaFile, MediaInfoResult, MediaMetadata, Track } from '@/types/mediainfo.types';

export interface MediaMetadataResult {
    file: File;
    metadata: MediaMetadata | null;
    error?: string;
}

export const useMediaMetadata = () => {
    const mediaInfoRef = useRef<MediaInfo<'JSON'> | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        mediaInfoFactory({
            format: 'JSON',
            locateFile: () => '/MediaInfoModule.wasm',
        })
            .then((mi) => {
                mediaInfoRef.current = mi;
            })
            .catch((error: unknown) => {
                console.error(error);
            });

        return () => {
            if (mediaInfoRef.current) {
                mediaInfoRef.current.close();
                mediaInfoRef.current = null;
            }
        };
    }, []);

    const extractSingleFileMetadata = useCallback(async (file: File): Promise<MediaMetadata | null> => {
        try {
            const info = await mediaInfoRef.current?.analyzeData(
                file.size,
                async (chunkSize: number, offset: number) =>
                    new Uint8Array(await file.slice(offset, offset + chunkSize).arrayBuffer()),
            );
            if (info !== undefined) {
                const mediaInfoResult: MediaInfoResult = JSON.parse(info);
                const tracks = mediaInfoResult.media.track;
                const fileName = file.name;
                const extension = getFileExtension(fileName);
                const fileSize = file.size;
                const duration = parseDuration(tracks);
                const finalDuration = duration && duration > 0 ? duration : 0;

                const width = toInteger(safeGetTrackValue(tracks, 'Video', 'Width'));
                const height = toInteger(safeGetTrackValue(tracks, 'Video', 'Height'));
                const resolution = formatResolution(width, height);
                const bitrate = toInteger(
                    safeGetTrackValue(tracks, 'Video', 'BitRate') ||
                        safeGetTrackValue(tracks, 'General', 'OverallBitRate'),
                );
                const codecInfo = String(
                    safeGetTrackValue(tracks, 'Video', 'Format') || safeGetTrackValue(tracks, 'Video', 'CodecID') || '',
                );
                const frameRate = toNumber(safeGetTrackValue(tracks, 'Video', 'FrameRate'));

                const audioCodec = String(
                    safeGetTrackValue(tracks, 'Audio', 'Format') || safeGetTrackValue(tracks, 'Audio', 'CodecID') || '',
                );
                const audioBitRate = toInteger(safeGetTrackValue(tracks, 'Audio', 'BitRate'));

                if (!fileName || !fileSize) {
                    throw new Error('Missing required file information');
                }

                return {
                    fileName,
                    extension,
                    resolution: resolution || '',
                    fileSize,
                    duration: finalDuration,
                    bitrate: bitrate || 0,
                    codecInfo: codecInfo || '',
                    frameRate: frameRate || 0,
                    audioCodec: audioCodec || '',
                    audioBitRate: audioBitRate || 0,
                } as MediaMetadata;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }, []);

    const extractMetadata = useCallback(
        async (mediaFiles: MediaFile[]): Promise<MediaMetadataResult[]> => {
            setIsExtracting(true);

            try {
                const results: MediaMetadataResult[] = [];

                for (const mediaFile of mediaFiles) {
                    try {
                        const metadata = await extractSingleFileMetadata(mediaFile.origin);

                        if (metadata) {
                            results.push({ file: mediaFile.origin, metadata });
                        } else {
                            results.push({
                                file: mediaFile.origin,
                                metadata: null,
                                error: 'Upload cannot proceed due to missing file details',
                            });
                        }
                    } catch {
                        results.push({
                            file: mediaFile.origin,
                            metadata: null,
                            error: 'Upload cannot proceed due to missing file details',
                        });
                    }
                }

                return results;
            } catch {
                return mediaFiles.map((mediaFile) => ({
                    file: mediaFile.origin,
                    metadata: null,
                    error: 'Upload cannot proceed due to missing file details',
                }));
            } finally {
                setIsExtracting(false);
            }
        },
        [extractSingleFileMetadata],
    );

    return {
        extractMetadata,
        isExtracting,
    };
};

const parseDuration = (tracks: readonly Track[]): number | undefined => {
    const generalTrack = tracks.find((t) => t['@type'] === 'General');

    if (generalTrack?.Duration) {
        const duration = parseFloat(String(generalTrack.Duration));
        if (!isNaN(duration) && duration > 0) {
            return duration;
        }
    }

    const videoTrack = tracks.find((t) => t['@type'] === 'Video');
    if (videoTrack?.Duration) {
        const duration = parseFloat(String(videoTrack.Duration));
        if (!isNaN(duration) && duration > 0) {
            return duration;
        }
    }

    const audioTrack = tracks.find((t) => t['@type'] === 'Audio');
    if (audioTrack?.Duration) {
        const duration = parseFloat(String(audioTrack.Duration));
        if (!isNaN(duration) && duration > 0) {
            return duration;
        }
    }

    return undefined;
};

const getFileExtension = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension || '';
};

const formatResolution = (width?: number, height?: number): string => {
    if (!width || !height) return '';
    return `${width}x${height}`;
};

const safeGetTrackValue = (
    tracks: readonly Track[],
    trackType: Track['@type'],
    parameter: string,
): string | number | undefined => {
    try {
        const track = tracks.find((t) => t['@type'] === trackType);
        return track?.[parameter];
    } catch {
        return undefined;
    }
};

const toNumber = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};

const toInteger = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return Math.round(value);
    if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};
