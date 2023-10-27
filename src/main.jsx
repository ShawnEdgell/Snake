import ReactDOM from 'react-dom/client'; // <-- Update the import path here
import App from './App.jsx';

// Get a reference to the root DOM node
const root = document.getElementById('root');

// Create a root for concurrent mode
const appRoot = ReactDOM.createRoot(root);

// Render the App component
appRoot.render(<App />);
