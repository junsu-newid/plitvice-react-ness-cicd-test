export interface UserState {
    userId: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface UserActions {
    login: (userId: string) => boolean;
    logout: () => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
    clearError: () => void;
}

export interface AuthenticationResult {
    success: boolean;
    error?: string;
}

export type UserAuthenticationFn = () => string;

export interface UseUserReturn extends UserState, UserActions {
    isValid: boolean;
    hasError: boolean;
    authenticate: (getUserIdFn: UserAuthenticationFn) => Promise<boolean>;
}
