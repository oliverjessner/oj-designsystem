import { story } from './helpers.js';

export default { title: 'Website/Blockquote' };

export const Quotation = story(
  `<article class="oj-prose"><figure><blockquote><p>Keep the interface quiet enough that the work stays visible.</p></blockquote><figcaption>Example quotation for interface documentation.</figcaption></figure></article>`,
  'An editorial quotation uses native blockquote and figure semantics, a restrained rule and normal reading typography.',
);
