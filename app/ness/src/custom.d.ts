import '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface ColumnMeta {
        pinned?: boolean;
        thStyle?: string;
        tdStyle?: string;
        widthStyle?: string;
        textAlign?: 'left' | 'right' | 'center';
    }
}
