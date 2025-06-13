import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import Playground from 'website/components/full-playground.gts';

interface IndexSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

<template>
  {{pageTitle "Playground"}}
  {{! NOTE: the 50px here is the exact height of header tag in application template }}
  <Playground class="h-[calc(100vh-50px)]" />
</template> satisfies TOC<IndexSignature>;
