import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

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
    <Illinois class="h-20 w-20 fill-primary stroke-primary" />
    <hr />

  </div>
</template> satisfies TOC<CompareSignature>;
