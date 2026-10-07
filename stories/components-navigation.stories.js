import { story } from './helpers.js';

export default { title: 'Components/Navigation' };
export const Destinations = story(
  `<div class="oj-stack"><nav class="oj-nav" aria-label="Main"><a class="oj-nav-link" href="#overview" aria-current="page">Overview</a><a class="oj-nav-link" href="#items" aria-current="false">Items</a><a class="oj-nav-link" href="#history">History</a></nav><nav class="oj-breadcrumb" aria-label="Breadcrumb"><ol><li><a class="oj-link" href="#projects">Projects</a></li><li><a class="oj-link" href="#image-project">Image workspace</a></li><li><span aria-current="page">Settings</span></li></ol></nav><nav class="oj-sidebar-nav" aria-label="Settings sections"><a class="oj-nav-link" href="#general" aria-current="page">General</a><a class="oj-nav-link" href="#export">Export</a><a class="oj-nav-link" href="#shortcuts">Shortcuts</a></nav></div>`,
  'Navigation uses anchors for destinations, aria-current for the active route and named landmarks for multiple navigation groups.',
);
