import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { userAtom, userIdAtom, userErrorAtom, userLoadingAtom } from '@/stores/userAtom';
import { UserActions, UserAuthenticationFn, UseUserReturn } from '@/types/user.types';
import { useCallback, useMemo } from 'react';

// Pure functions for user state management
const isUserValid = (userId: string): boolean => Boolean(userId?.trim());

const createUserActions = (
    setUserId: (userId: string) => void,
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void,
): UserActions => ({
    login: (userId: string) => {
        if (!isUserValid(userId)) {
            setError('Invalid user ID');
            return false;
        }
        setUserId(userId);
        return true;
    },

    logout: () => {
        setUserId('');
        setError(null);
    },

    setError: (error: string | null) => {
        setError(error);
    },

    setLoading: (loading: boolean) => {
        setLoading(loading);
    },

    clearError: () => {
        setError(null);
    },
});

// Main hook with functional composition
export const useUser = (): UseUserReturn => {
    const userState = useAtomValue(userAtom);
    const [userId, setUserId] = useAtom(userIdAtom);
    const setError = useSetAtom(userErrorAtom);
    const setLoading = useSetAtom(userLoadingAtom);

    const actions = useMemo(
        () => createUserActions(setUserId, setError, setLoading),
        [setUserId, setError, setLoading],
    );

    const authenticate = useCallback(
        async (getUserIdFn: UserAuthenticationFn) => {
            try {
                setLoading(true);
                const id = getUserIdFn();
                return actions.login(id);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
                actions.setError(errorMessage);
                return false;
            }
        },
        [actions, setLoading],
    );

    return {
        // State
        ...userState,
        userId,

        // Computed values
        isValid: isUserValid(userId),
        hasError: Boolean(userState.error),

        // Actions
        ...actions,
        authenticate,
    };
};

// Specialized hooks for specific use cases
export const useUserId = () => useAtomValue(userIdAtom);

export const useUserActions = () => {
    const setUserId = useSetAtom(userIdAtom);
    const setError = useSetAtom(userErrorAtom);
    const setLoading = useSetAtom(userLoadingAtom);

    return useMemo(() => createUserActions(setUserId, setError, setLoading), [setUserId, setError, setLoading]);
};

export const useUserState = () => useAtomValue(userAtom);
