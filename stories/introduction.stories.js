import { story } from './helpers.js';

export default { title: 'Introduction' };

export const Overview = story(`
  <article class="oj-prose">
    <p class="oj-kicker">oj-designsystem · 0.1</p>

    <h1>One design system, different products</h1>

    <p>
      oj-designsystem is the shared UI foundation for Oliver Jessner's
      websites, desktop tools and browser applications.
    </p>

    <p>
      It provides a consistent visual language, reusable components,
      typography, interaction patterns and accessibility defaults without
      forcing every product to look identical.
    </p>

    <h2>Used across</h2>

    <ul>
      <li>
        <a class="oj-link" href="https://oliverjessner.at/" target="_blank" rel="noopener noreferrer">
          <strong>oliverjessner.at</strong>
        </a>
        — editorial website, articles, projects and portfolio
      </li>

      <li>
        <a class="oj-link" href="https://oliverjessner.at/bulkpixel/" target="_blank" rel="noopener noreferrer">
          <strong>BulkPixel</strong>
        </a>
        — native batch image conversion and workflow management
      </li>

      <li>
        <a class="oj-link" href="https://oliverjessner.at/pinefetch/" target="_blank" rel="noopener noreferrer">
          <strong>PineFetch</strong>
        </a>
        — local-first media collection, transcription and OCR
      </li>

      <li>
        <a class="oj-link" href="https://oliverjessner.at/Pitchary/" target="_blank" rel="noopener noreferrer">
          <strong>Pitchary</strong>
        </a>
        — A full CRM with OCR on the bill
      </li>

      <li>
        <a class="oj-link" href="https://oliverjessner.at/NO-BULLSHIT-RSS/" target="_blank" rel="noopener noreferrer">
          <strong>NO-BULLSHIT-RSS</strong>
        </a>
        — focused RSS reading and feed tooling
      </li>

      <li>
        <a
          class="oj-link"
          href="https://chromewebstore.google.com/detail/linkyard/gjiooiibelbfndjihhkppkflbflopnpp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Linkyard</strong>
        </a>
        — browser extension for link and research workflows
      </li>
    </ul>

    <h2>Principles</h2>

    <ol>
      <li>Function over decoration</li>
      <li>Dense but readable</li>
      <li>Consistent before custom</li>
      <li>Native HTML first</li>
      <li>Accessibility by default</li>
      <li>Accent, not rebranding</li>
      <li>Components, not application architecture</li>
      <li>Calm interfaces</li>
      <li>No AI aesthetic</li>
      <li>One family, different products</li>
    </ol>

    <h2>Shared foundation</h2>

    <p>
      Products share the same component vocabulary and interaction rules,
      while product-specific layouts and workflows remain in the consumer.
    </p>

    <p>
      A button should behave like a button everywhere. Inputs, dialogs,
      navigation, tables, settings and feedback states should feel familiar
      regardless of which product is being used.
    </p>

    <h2>Product identity</h2>

    <p>
      Individual products can define their own accent color while keeping
      the underlying design language intact.
    </p>

    <pre><code>:root {
  --oj-accent: #7d34c5;
}</code></pre>

    <p>
      Semantic colors such as success, warning and danger remain independent
      from product branding.
    </p>

    <h2>Install</h2>

    <pre><code>npm install oj-designsystem</code></pre>

    <pre><code>import 'oj-designsystem/styles.css';
import { initOJ } from 'oj-designsystem';

const destroy = initOJ();</code></pre>

    <h2>Static websites</h2>

    <p>
      The design system can also be used without a JavaScript framework.
      This allows oliverjessner.at to use the same components as the desktop
      and browser applications.
    </p>

    <h2>Typography and icons</h2>

    <p>
      Comfortaa and JetBrains Mono ship as local WOFF2 files. Icons are
      provided through Font Awesome Free. No external font or icon CDN is
      required.
    </p>

    <h2>Use existing components first</h2>

    <p>
      Keep application-specific layout, routing, data processing, search,
      billing and domain logic inside the consuming product.
    </p>

    <p>
      Use oj-designsystem for shared visible controls, visual foundations
      and interaction contracts.
    </p>

    <h2>Keyboard and accessibility</h2>

    <p>
      Components are designed around native HTML semantics, visible keyboard
      focus and predictable interaction patterns.
    </p>

    <p>
      Use the Accessibility panel and viewport toolbar in Storybook to inspect
      components across desktop, laptop, tablet and mobile layouts.
    </p>
  </article>
`);
