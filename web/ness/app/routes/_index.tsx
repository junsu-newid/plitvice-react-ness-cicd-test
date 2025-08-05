import type { Route } from '../+types/root';
import Home from '@/features/home.tsx';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
    return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Index() {
    return <Home />;
}
