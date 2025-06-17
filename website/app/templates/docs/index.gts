import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';

<template>
  {{pageTitle "Home"}}
  <h1 class="text-3xl font-bold mb-4">svg2ember Documentation</h1>
  <ul>
    <li>
      <LinkTo @route="docs.cli" class="link">CLI</LinkTo>
    </li>
    <li>
      <LinkTo @route="docs.vite" class="link">Vite plugin</LinkTo>
    </li>
    <li>
      <LinkTo @route="docs.core" class="link">Core API</LinkTo>
    </li>
  </ul>
</template>
