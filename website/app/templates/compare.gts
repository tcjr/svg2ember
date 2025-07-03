import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

import IllinoisUrl from 'website/svgs/THE_STATE_OF_ILLINOIS.svg';
import Illinois from 'website/svgs/THE_STATE_OF_ILLINOIS.svg?component';
import ghostDuotone from '@phosphor-icons/core/duotone/ghost-duotone.svg';
import Ghost from '@phosphor-icons/core/fill/ghost-fill.svg?component';
import Bell from '@fortawesome/fontawesome-free/svgs/regular/bell.svg?component';
import BellSolid from '@fortawesome/fontawesome-free/svgs/solid/bell.svg?component';
import Ember from '@fortawesome/fontawesome-free/svgs/brands/ember.svg?component';
import PartyPopper from 'website/svgs/party-popper.svg?component';

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
    <Ghost class="h-20 w-20 inline-block">
      {{! any valid child of SVG can go here }}
      <animate
        attributeName="fill"
        values="blue;white;blue"
        dur="800ms"
        repeatCount="indefinite"
      />
    </Ghost>

    <hr />

    <Bell class="h-20 w-20 inline-block fill-sky-800" />
    <BellSolid class="h-20 w-20 inline-block fill-sky-800" />

    <hr />

    <Ember class="h-36 inline-block fill-[#cf2d20]" />

    <hr />

    <PartyPopper class="w-12 h-12" />

  </div>
</template> satisfies TOC<CompareSignature>;
