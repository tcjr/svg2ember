import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';

interface IndexSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

<template>
  {{pageTitle "Home"}}
  <p>
    Convert SVGs to Ember components at build-time.
  </p>
  <p>
    Try it out in the
    <LinkTo @route="playground" class="link">Playground</LinkTo>.
  </p>
  <p>

    <LinkTo @route="compare" class="link">Compare imports</LinkTo>
  </p>
  <p>
    <LinkTo @route="cli" class="link">CLI Documentation</LinkTo>
  </p>
  <hr />
</template> satisfies TOC<IndexSignature>;
