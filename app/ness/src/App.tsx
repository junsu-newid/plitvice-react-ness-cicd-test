import { RouterProvider } from 'react-router';
import router from '@/routes';
import '@plitvice/ui/styles/global.css';

function App() {
    return <RouterProvider router={router} />;
}

export default App;
