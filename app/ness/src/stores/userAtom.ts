import { atom } from 'jotai';
import { UserState } from '@/types/user.types';

const initialUserState: UserState = {
    userId: '',
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

export const userAtom = atom<UserState>(initialUserState);

export const userIdAtom = atom(
    (get) => get(userAtom).userId,
    (get, set, userId: string) => {
        set(userAtom, {
            ...get(userAtom),
            userId,
            isAuthenticated: Boolean(userId),
            isLoading: false,
            error: null,
        });
    },
);

export const userErrorAtom = atom(
    (get) => get(userAtom).error,
    (get, set, error: string | null) => {
        set(userAtom, {
            ...get(userAtom),
            error,
            isLoading: false,
        });
    },
);

export const userLoadingAtom = atom(
    (get) => get(userAtom).isLoading,
    (get, set, isLoading: boolean) => {
        set(userAtom, {
            ...get(userAtom),
            isLoading,
        });
    },
);
