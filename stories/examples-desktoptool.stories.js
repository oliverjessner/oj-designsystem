import { story } from './helpers.js';
import markup from '../examples/vanilla/template.html?raw';
import { setupTool } from '../examples/vanilla/demo.js';
import '../examples/vanilla/style.css';

export default { title: 'Examples/DesktopTool' };
export const Workspace = story(
  markup,
  'A complete compact utility composition. Search, sort, select files, change controls and try the dialog/dropdown. This is a local preview; no files are converted.',
  setupTool,
);
