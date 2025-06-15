import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

import IllinoisUrl from 'website/svgs/THE_STATE_OF_ILLINOIS.svg';
import Illinois from 'website/svgs/THE_STATE_OF_ILLINOIS.svg?component';

interface CompareSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

<template>
  {{pageTitle "Compare"}}
  <div>
    <h2>url image import</h2>
    <img src={{IllinoisUrl}} class="h-20 w-20" alt="illinois" />
    <hr />

    <h2><code>?component</code> import</h2>
    <Illinois class="h-20 w-20 fill-primary stroke-primary text-primary" />
    <hr />

  </div>
</template> satisfies TOC<CompareSignature>;
