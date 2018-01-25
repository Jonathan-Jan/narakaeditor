import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <MuiThemeProvider>
        <App />
    </MuiThemeProvider>
, document.getElementById('root'));
registerServiceWorker();

window.addEventListener('keydown', function(e) {
    if (e.keyIdentifier == 'U+0008' || e.keyIdentifier == 'Backspace') {
        if (e.target == document.body) {
            e.preventDefault();
        }
    }
}, true);

window.addEventListener('keyup', function(e) {
    if (e.keyIdentifier == 'U+0008' || e.keyIdentifier == 'Backspace') {
        if (e.target == document.body) {
            e.preventDefault();
        }
    }
}, true);
