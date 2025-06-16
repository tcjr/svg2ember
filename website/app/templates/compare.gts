import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

import IllinoisUrl from 'website/svgs/THE_STATE_OF_ILLINOIS.svg';
import Illinois from 'website/svgs/THE_STATE_OF_ILLINOIS.svg?component';
import ghostDuotone from '@phosphor-icons/core/duotone/ghost-duotone.svg';
import Ghost from '@phosphor-icons/core/fill/ghost-fill.svg?component';

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
    <img src={{ghostDuotone}} class="h-20 w-20" alt="ghost" />
    <hr />

    <h2><code>?component</code> import</h2>
    <Illinois class="h-20 w-20 fill-primary stroke-primary text-primary" />
    <Ghost class="h-20 w-20 fill-pink-300 inline-block" />
    <Ghost class="h-20 w-20 fill-cyan-300 inline-block" />
    <Ghost class="h-20 w-20 fill-red-500 inline-block" />
    <Ghost class="h-20 w-20 fill-orange-400 inline-block" />
    <hr />

  </div>
</template> satisfies TOC<CompareSignature>;
