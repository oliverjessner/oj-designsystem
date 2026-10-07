import { story, notify } from './helpers.js';

export default { title: 'Patterns/Form' };

export const Project = story(
  `<form class="oj-panel oj-stack oj-demo-form"><h2 class="oj-heading-3">Create project</h2><div class="oj-field"><label class="oj-label" for="project-name">Project name</label><input class="oj-input" id="project-name" name="projectName" autocomplete="off" required aria-describedby="project-help" /><p class="oj-helper" id="project-help">Choose a descriptive name for this workspace.</p></div><div class="oj-field"><label class="oj-label" for="project-description">Description</label><textarea class="oj-textarea" id="project-description" name="description" rows="3"></textarea></div><label class="oj-check"><input class="oj-checkbox" type="checkbox" name="metadata" checked /> Preserve image metadata</label><div class="oj-cluster"><button class="oj-button oj-button-primary" type="submit">Create project</button><button class="oj-button oj-button-ghost" type="reset">Reset</button></div><p class="oj-helper">Demo form: no data is transmitted.</p></form>`,
  'Native required validation, visible labels and real submit/reset buttons remain intact.',
  (root) => {
    root.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      notify(root, 'Demo project created.');
    });
  },
);
