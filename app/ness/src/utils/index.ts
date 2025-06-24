/**
 * 초를 h:m:s 형태로 변환
 */
export const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
};

/**
 * 바이트를 읽기 쉬운 형태로 변환
 */
export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 비트레이트를 읽기 쉬운 형태로 변환
 *
 * 비트레이트(Bitrate)란 1초에 해당하는 동영상에 얼마의 비트(bit) 수를 가지느냐를 의미.
 * 높을수록 좋은 화질이지만, 용량또한 커지게 됨.
 */
export const formatBitrate = (bps: number) => {
    if (bps < 1000) {
        return `${bps} bps`;
    } else if (bps < 1000000) {
        return `${(bps / 1000).toFixed(0)} kbps`;
    } else {
        return `${(bps / 1000000).toFixed(1)} Mbps`;
    }
};

import Cookies from 'js-cookie';

/**
 * 쿠키에서 사용자 ID를 가져오는 함수
 * 쿠키는 브라우저 메모리에 저장되어 있으므로 네트워크 요청이나 파일 시스템 접근이 필요하지 않아 동기 함수로 작성.
 */
export const getUserId = () => {
    const userId = Cookies.get('previous_id_logged');
    if (!userId) {
        throw new Error('User ID not found in cookies');
    }
    return userId;
};
