import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "svg2ember"}}
  {{! NOTE: if you change 50px here, you have to change it in calc() from child templates too }}
  <header class="bg-base-200 text-base-content h-[50px]">
    svg2ember
  </header>
  <main class="bg-base-100 text-base-content">
    {{outlet}}
  </main>
</template>
