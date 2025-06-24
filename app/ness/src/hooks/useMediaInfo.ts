import { useState, useCallback } from 'react';
import type { MediaInfoResult, Track, MediaInfoInstance, MediaInfoFactory } from '@/types/mediainfo.types';

// MediaInfo 전역 타입 선언
declare global {
    interface Window {
        MediaInfo: MediaInfoFactory;
    }
}

export interface MediaMetadata {
    fileName: string;
    extension: string;
    resolution: string;
    fileSize: number;
    duration: number;
    bitrate: number;
    codecInfo: string;
    frameRate: number;
    audioCodec: string;
    audioBitRate: number;
}

export interface MediaMetadataResult {
    file: File;
    metadata: MediaMetadata | null;
    error?: string;
}

export const useMediaMetadata = () => {
    const [isExtracting, setIsExtracting] = useState(false);

    /**
     * 파일 확장자 추출 함수
     */
    const getFileExtension = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return extension || '';
    };

    /**
     * 해상도 문자열 생성
     */
    const formatResolution = (width?: number, height?: number): string => {
        if (!width || !height) return '';
        return `${width}x${height}`;
    };

    /**
     * Track에서 안전하게 값 추출 (타입 안전)
     */
    const safeGetTrackValue = useCallback(
        (tracks: readonly Track[], trackType: Track['@type'], parameter: string): string | number | undefined => {
            try {
                const track = tracks.find((t) => t['@type'] === trackType);
                return track?.[parameter];
            } catch (error) {
                console.warn(`Failed to get ${parameter} from ${trackType}:`, error);
                return undefined;
            }
        },
        [],
    );

    /**
     * 문자열 또는 숫자 값을 숫자로 안전하게 변환
     */
    const toNumber = useCallback((value: string | number | undefined): number | undefined => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
    }, []);

    /**
     * 정수 값을 안전하게 파싱
     */
    const toInteger = useCallback((value: string | number | undefined): number | undefined => {
        if (typeof value === 'number') return Math.round(value);
        if (typeof value === 'string') {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
    }, []);

    /**
     * Duration 값을 안전하게 파싱 (초 단위로 변환)
     */
    const parseDuration = useCallback(
        (tracks: readonly Track[]): number | undefined => {
            // 1. General 트랙에서 숫자 형태의 Duration 시도
            const durationValue = safeGetTrackValue(tracks, 'General', 'Duration');
            const durationNum = toNumber(durationValue);
            if (durationNum && durationNum > 0) {
                // MediaInfo.js에서 Duration은 밀리초 단위로 제공되므로 초로 변환
                console.log('Duration from General (ms):', durationNum);
                return durationNum / 1000;
            }

            // 2. Video 트랙에서 Duration 시도
            const videoDurationValue = safeGetTrackValue(tracks, 'Video', 'Duration');
            const videoDurationNum = toNumber(videoDurationValue);
            if (videoDurationNum && videoDurationNum > 0) {
                console.log('Duration from Video (ms):', videoDurationNum);
                return videoDurationNum / 1000;
            }

            // 3. Duration_String 형식 파싱 (HH:MM:SS.mmm)
            const durationString =
                safeGetTrackValue(tracks, 'General', 'Duration_String') ||
                safeGetTrackValue(tracks, 'General', 'Duration/String') ||
                safeGetTrackValue(tracks, 'General', 'Duration_String1');

            if (typeof durationString === 'string') {
                console.log('Duration string:', durationString);
                const timeMatch = durationString.match(/(\d+):(\d+):(\d+)\.?(\d+)?/);
                if (timeMatch) {
                    const hours = parseInt(timeMatch[1], 10);
                    const minutes = parseInt(timeMatch[2], 10);
                    const seconds = parseInt(timeMatch[3], 10);
                    const milliseconds = timeMatch[4] ? parseInt(timeMatch[4].padEnd(3, '0').substring(0, 3), 10) : 0;

                    const duration = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
                    console.log('Parsed duration from string:', duration);
                    return duration;
                }
            }

            return undefined;
        },
        [safeGetTrackValue, toNumber],
    );

    /**
     * 단일 파일의 메타데이터 추출
     */
    const extractSingleFileMetadata = useCallback(
        async (file: File): Promise<MediaMetadata | null> => {
            try {
                // MediaInfo 라이브러리 로드 확인
                if (!window.MediaInfo) {
                    throw new Error('MediaInfo library not loaded');
                }

                // MediaInfo 인스턴스 생성
                const mediainfo: MediaInfoInstance = await window.MediaInfo({
                    format: 'object',
                    locateFile: (path: string, prefix: string) => {
                        if (path.endsWith('.wasm')) {
                            return 'https://unpkg.com/mediainfo.js@0.1.7/dist/MediaInfoModule.wasm';
                        }
                        return prefix + path;
                    },
                });

                // 파일을 ArrayBuffer로 변환
                const arrayBuffer = await file.arrayBuffer();
                const fileData = new Uint8Array(arrayBuffer);

                // MediaInfo로 분석
                const result: MediaInfoResult = await mediainfo.analyzeData(
                    () => fileData.length,
                    (chunkSize: number, offset: number) =>
                        new Uint8Array(fileData.buffer, offset, Math.min(chunkSize, fileData.length - offset)),
                );

                // 결과 검증
                if (!result?.media?.track || !Array.isArray(result.media.track)) {
                    throw new Error('Invalid MediaInfo result');
                }

                console.log('MediaInfo 전체 결과:', result);

                const tracks = result.media.track;

                // 기본 정보 추출
                const fileName = file.name;
                const extension = getFileExtension(fileName);
                const fileSize = file.size;

                // Duration 파싱 (초 단위)
                const duration = parseDuration(tracks);
                if (!duration || duration <= 0) {
                    throw new Error('Duration parsing failed or invalid duration');
                }

                // Video 정보 추출
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

                // Audio 정보 추출
                const audioCodec = String(
                    safeGetTrackValue(tracks, 'Audio', 'Format') || safeGetTrackValue(tracks, 'Audio', 'CodecID') || '',
                );

                const audioBitRate = toInteger(safeGetTrackValue(tracks, 'Audio', 'BitRate'));

                // 필수 필드 검증
                const requiredFields = {
                    fileName,
                    extension,
                    resolution,
                    fileSize,
                    duration,
                    bitrate,
                    codecInfo,
                    frameRate,
                    audioCodec,
                    audioBitRate,
                };

                // 필수 값 검증
                for (const [key, value] of Object.entries(requiredFields)) {
                    if (
                        value === undefined ||
                        value === null ||
                        value === '' ||
                        (typeof value === 'number' && (isNaN(value) || value <= 0))
                    ) {
                        throw new Error(`Missing or invalid ${key}: ${value}`);
                    }
                }

                const metadata: MediaMetadata = {
                    fileName,
                    extension,
                    resolution,
                    fileSize,
                    duration,
                    bitrate: bitrate!,
                    codecInfo,
                    frameRate: frameRate!,
                    audioCodec,
                    audioBitRate: audioBitRate!,
                };

                // MediaInfo 인스턴스 정리
                mediainfo.close();

                return metadata;
            } catch (error) {
                console.error('메타데이터 추출 실패:', error);
                return null;
            }
        },
        [parseDuration, toInteger, safeGetTrackValue, toNumber],
    );

    /**
     * 여러 파일의 메타데이터 추출
     */
    const extractMetadata = useCallback(
        async (files: File[]): Promise<MediaMetadataResult[]> => {
            setIsExtracting(true);

            try {
                const results: MediaMetadataResult[] = [];

                for (const file of files) {
                    try {
                        const metadata = await extractSingleFileMetadata(file);

                        if (metadata) {
                            results.push({ file, metadata });
                        } else {
                            results.push({
                                file,
                                metadata: null,
                                error: 'Upload cannot proceed due to missing file details',
                            });
                        }
                    } catch (error) {
                        console.error(`Error processing file ${file.name}:`, error);
                        results.push({
                            file,
                            metadata: null,
                            error: 'Upload cannot proceed due to missing file details',
                        });
                    }
                }

                return results;
            } catch (error) {
                console.error('메타데이터 추출 중 오류:', error);
                return files.map((file) => ({
                    file,
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
