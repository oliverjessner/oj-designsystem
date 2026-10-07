# Accessibility and verification

Target WCAG 2.2 AA for the provided component contracts in current Chromium, Firefox and WebKit. Automated scans and behavior tests support this target; they are not a blanket compliance claim for arbitrary consumer markup.

## Authoring contracts

- Use native button/input/select/dialog/details/progress semantics. Icons are decorative with `aria-hidden`; icon-only controls still need an accessible name.
- Every form field has a visible label. Use `aria-describedby` for help and error text, `aria-invalid="true"` for errors; errors include readable text. Readonly values remain copyable; disabled controls are visibly inactive.
- Tabs label their tablist and pair tab/panel IDs. Menus are action menus with menuitem semantics; ordinary site navigation uses native links. Pagination labels its nav and uses `aria-current="page"`.
- Table headers use `scope`, captions explain the data, sortable headers reflect real app sort with `aria-sort` on the `th`. Styling a row as selected does not make it an accessible interactive row: provide a checkbox or explicit selection text. Use actual links/buttons for row actions.
- Status combines text with color/dot. Native progress needs an accessible label; indeterminate progress omits `value`. Spinner/skeleton accompany visible or screenreader loading text and do not replace it.
- Native dialogs need a heading/name, sensible autofocus and a trigger to restore focus to. Essential information must remain visible rather than live solely in tooltip/toast.
- Keep focus outlines. App-specific motion also needs a reduced-motion rule; library controls disable their own animation. Wrapping layouts and scrolling table/code regions must not clip focus outlines.

## Typography review

The Foundations/Typography readability story shows 12px, 13px, 14px and 16px Comfortaa, long labels, punctuation, numbers and input text. Form, Table, Navigation, Prose and both example stories show it in context. Review desktop 1440, laptop 1024, tablet 768 and mobile 375/390. Small labels use stronger weight/normal leading; article prose uses 16px relaxed leading and a 68ch maximum measure. Technical paths/numbers/code use JetBrains Mono. Small copy never uses an arbitrary raw product accent.

## Automated checks

`npm test`: public behaviors and literal-text safety in jsdom. `npm run test:browser`: actual native dialog focus/Escape, menu/tab keyboard flow, tooltip/toast behavior, local font/icon loading, responsive widths, reduced motion, and WCAG-tagged axe scans with five accents. Storybook stories are also scanned in a real Chromium browser. Font checks wait for `document.fonts.ready`; distribution checks resolve every CSS asset path inside the npm tarball. [QUALITY](QUALITY.md) records the completed gate results and practical limits.

Consumer custom tokens, third-party content, routing and app-only layouts must be checked independently. Keyboard and screenreader review remains useful alongside automated checks; no automated audit fully establishes usability.
