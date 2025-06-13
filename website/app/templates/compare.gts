import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import IllinoisCliGjs from 'website/svgs/Illinois.gjs';
import IllinoisCliGts from 'website/svgs/Illinois.gts';
import IllinoisSvgUrl from 'website/svgs/Illinois.svg';
// import Illinois from 'website/svgs/Illinois.svg?component';

interface CompareSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

<template>
  {{pageTitle "Compare"}}
  <div>
    <IllinoisCliGjs class="h-20 w-20 fill-primary stroke-primary" />
    <hr />
    <IllinoisCliGts class="h-20 w-20" />
    <hr />
    <img src={{IllinoisSvgUrl}} alt="Illinois" class="h-20 w-20" />
    <hr />
    {{! <Illinois class="h-20 w-20 fill-primary stroke-primary" /> }}
    <hr />

  </div>
</template> satisfies TOC<CompareSignature>;
