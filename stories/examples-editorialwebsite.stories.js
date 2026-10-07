import { story } from './helpers.js';
import markup from '../examples/website/template.html?raw';
import { setupJournal } from '../examples/website/demo.js';
import '../examples/website/style.css';

export default { title: 'Examples/EditorialWebsite' };
export const Journal = story(
  markup,
  'Editorial content shares the tool foundations while using a looser reading layout. Search filters the related notes; the form validates locally.',
  setupJournal,
);
