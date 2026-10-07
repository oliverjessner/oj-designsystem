import 'oj-designsystem/styles.css';
import { initOJ } from 'oj-designsystem';
import markup from './template.html?raw';
import { setupJournal } from './demo.js';
import './style.css';

const root = document.querySelector('#app');
// This static template is authored in the repository; entered text is never injected as HTML.
root.innerHTML = markup;
const cleanupDemo = setupJournal(root);
const cleanupOJ = initOJ(root);
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    cleanupDemo();
    cleanupOJ();
  });
