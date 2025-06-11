import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

interface IndexSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

<template>
  {{pageTitle "Index"}}
  {{! NOTE: the 50px here is the exact height of header tag in application template }}
  <div class="grid grid-cols-[min-content_1fr] h-[calc(100vh-50px)]">
    <div class="w-48 bg-pink-300">
      (settings)
    </div>
    <div class="grid grid-cols-2 bg-green-300">
      <div class="bg-yellow-300">
        (input)
      </div>
      <div class="bg-blue-300">
        (output)
      </div>
    </div>
  </div>
</template> satisfies TOC<IndexSignature>;
