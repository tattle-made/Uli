import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './ui-components/pages/App';

const app = document.getElementById('app');
const root = createRoot(app);
root.render(
    <Router>
        <App />
    </Router>
);
