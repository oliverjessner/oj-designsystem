import 'oj-designsystem/styles.css';
import { initOJ } from 'oj-designsystem';
import markup from './template.html?raw';
import { setupTool } from './demo.js';
import './style.css';

const root = document.querySelector('#app');
// Static repository-authored template; selected file names are rendered with textContent.
root.innerHTML = markup;
const cleanupDemo = setupTool(root);
const cleanupOJ = initOJ(root);
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    cleanupDemo();
    cleanupOJ();
  });
