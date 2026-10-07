import 'oj-designsystem/styles.css';
import { initOJ } from 'oj-designsystem';
import { useEffect, useMemo } from 'storybook/preview-api';
import './preview.css';

const accents = {
  green: '#22c55e',
  purple: '#7d34c5',
  blue: '#3b82f6',
  orange: '#f97316',
  red: '#ef4444',
};

const controllerCleanups = new WeakMap();

export default {
  globalTypes: {
    accent: {
      description: 'Product accent: only --oj-accent changes',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'green', title: 'BulkPixel Green' },
          { value: 'purple', title: 'OJ Purple' },
          { value: 'blue', title: 'Blue' },
          { value: 'orange', title: 'Orange' },
          { value: 'red', title: 'Red' },
        ],
      },
    },
  },
  initialGlobals: { accent: 'green' },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Components',
          'Website',
          'Patterns',
          'Examples',
        ],
      },
    },
    viewport: {
      options: {
        desktop: {
          name: 'Desktop · 1440',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
        laptop: {
          name: 'Laptop · 1024',
          styles: { width: '1024px', height: '768px' },
          type: 'desktop',
        },
        tablet: {
          name: 'Tablet · 768',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        mobile: {
          name: 'Mobile · 390',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Addon and play state updates can render again without changing the
      // component. Keep that DOM and its controller stable until inputs change.
      const argsKey = JSON.stringify(context.args);
      const wrapper = useMemo(() => {
        const element = document.createElement('div');
        element.className = 'oj-root oj-story-wrapper';
        element.dataset.ojTheme = 'dark';
        element.style.setProperty(
          '--oj-accent',
          accents[context.globals.accent] || accents.green,
        );
        return element;
      }, [context.id, argsKey, context.globals.accent]);
      const story = Story();
      if (!wrapper.childNodes.length) {
        if (typeof story === 'string') wrapper.innerHTML = story;
        else wrapper.append(story);
        // Storybook can start play before hook effects run. Initialize the
        // scoped DOM immediately; listeners remain valid once it is mounted.
        controllerCleanups.set(wrapper, initOJ(wrapper));
      } else if (story instanceof Element && !wrapper.contains(story)) {
        // Story() still runs so nested decorators keep their hook lifecycle.
        // Dispose handlers on the unused fresh demo instead of leaking them.
        story.ojStoryCleanup?.();
        story
          .querySelectorAll('.oj-story-demo')
          .forEach((element) => element.ojStoryCleanup?.());
      }
      useEffect(() => {
        return () => {
          controllerCleanups.get(wrapper)?.();
          controllerCleanups.delete(wrapper);
          wrapper
            .querySelectorAll('.oj-story-demo')
            .forEach((element) => element.ojStoryCleanup?.());
        };
      }, [wrapper]);
      return wrapper;
    },
  ],
};
