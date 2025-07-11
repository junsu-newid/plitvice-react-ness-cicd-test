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
    const parseDuration = useCallback((tracks: readonly Track[]): number | undefined => {
        // General 트랙에서 Duration 추출
        const generalTrack = tracks.find((t) => t['@type'] === 'General');

        if (generalTrack?.Duration) {
            const duration = parseFloat(String(generalTrack.Duration));
            if (!isNaN(duration) && duration > 0) {
                // MediaInfo의 Duration은 이미 초 단위
                return duration;
            }
        }

        // Video 트랙에서 Duration 추출
        const videoTrack = tracks.find((t) => t['@type'] === 'Video');
        if (videoTrack?.Duration) {
            const duration = parseFloat(String(videoTrack.Duration));
            if (!isNaN(duration) && duration > 0) {
                return duration;
            }
        }

        // Audio 트랙에서 Duration 추출
        const audioTrack = tracks.find((t) => t['@type'] === 'Audio');
        if (audioTrack?.Duration) {
            const duration = parseFloat(String(audioTrack.Duration));
            if (!isNaN(duration) && duration > 0) {
                return duration;
            }
        }

        return undefined;
    }, []);

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

                const tracks = result.media.track;

                // 기본 정보 추출
                const fileName = file.name;
                const extension = getFileExtension(fileName);
                const fileSize = file.size;

                // Duration 파싱 (초 단위)
                const duration = parseDuration(tracks);

                // Duration이 없어도 메타데이터 추출 계속 진행
                const finalDuration = duration && duration > 0 ? duration : 0;

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
                if (!fileName || !fileSize) {
                    throw new Error('Missing required file information');
                }

                // 메타데이터 객체 생성
                const metadata: MediaMetadata = {
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
