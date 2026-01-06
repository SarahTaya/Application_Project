


import ReactDOM from 'react-dom/client';

import './Style.css'

import "./colors/variables.css";



import App from './app/App';
import { ThemeProvider } from './Theme/ThemeContext';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // browserroter it define that the project will be use the route
<ThemeProvider>
  <App />
</ThemeProvider>
  


);


