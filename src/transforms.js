/* eslint-env node, mocha */

import { FrontMatter } from './front-matter';

/* Extractors */
import ExtractFrontmatter from './extractors/front-matter';
import ExtractBibliography from './extractors/bibliography';
import ExtractCitations from './extractors/citations';

const extractors = new Map([
  ['ExtractFrontmatter', ExtractFrontmatter],
  ['ExtractBibliography', ExtractBibliography],
  ['ExtractCitations', ExtractCitations],
]);

/* Transforms */
import HTML from './transforms/html';
import Byline from './transforms/byline';
import Polyfills from './transforms/polyfills';
import OptionalComponents from './transforms/optional-components';
import Mathematics from './transforms/mathematics';
import Meta from './transforms/meta';
import { makeStyleTag } from './styles/styles';
import TOC from './transforms/toc';
import Typeset from './transforms/typeset';
import Bibliography from './transforms/bibliography';

const transforms = new Map([
  ['HTML', HTML],
  ['makeStyleTag', makeStyleTag],
  ['Polyfills', Polyfills],
  ['OptionalComponents', OptionalComponents],
  ['TOC', TOC],
  ['Byline', Byline],
  ['Mathematics', Mathematics],
  ['Meta', Meta],
  ['Typeset', Typeset],
  ['Bibliography', Bibliography],
]);

/* Distill Transforms */
import DistillHeader from './distill-transforms/distill-header';
import DistillAppendix from './distill-transforms/distill-appendix';
import DistillFooter from './distill-transforms/distill-footer';

const distillTransforms = new Map([
  ['DistillHeader', DistillHeader],
  ['DistillAppendix', DistillAppendix],
  ['DistillFooter', DistillFooter],
]);

/* Exported functions */

export function render(dom, data, verbose=true) {
  // first, we collect static data from the dom
  for (const [name, extract] of extractors.entries()) {
    if (verbose) console.warn('Running extractor: ' + name);
    extract(dom, data, verbose);
  }
  // secondly we use it to transform parts of the dom
  for (const [name, transform] of transforms.entries()) {
    if (verbose) console.warn('Running transform: ' + name);
    // console.warn('Running transform: ', transform);
    transform(dom, data, verbose);
  }
  dom.body.setAttribute('distill-prerendered', '');
  // the function calling us can now use the transformed dom and filled data object
}

export function distillify(dom, data, verbose=true) {
  // thirdly, we can use these additional transforms when publishing on the Distill website
  for (const [name, transform] of distillTransforms.entries()) {
    if (verbose) console.warn('Running distillify: ', name);
    transform(dom, data, verbose);
  }
}

export function usesTemplateV2(dom) {
  const tags = dom.querySelectorAll('script');
  let usesV2 = undefined;
  for (const tag of tags) {
    const src = tag.src;
    if (src.includes('template.v1.js')) {
      usesV2 = false;
    } else if (src.includes('template.v2.js')) {
      usesV2 = true;
    } else if (src.includes('template.')) {
      throw new Error('Uses distill template, but unknown version?!');
    }
  }

  if (usesV2 === undefined) {
    throw new Error('Does not seem to use Distill template at all.');
  } else {
    return usesV2;
  }
}
export { FrontMatter }; // TODO: removable?

export const testing = {
  extractors: extractors,
  transforms: transforms,
  distillTransforms: distillTransforms
};
