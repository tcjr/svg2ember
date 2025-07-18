import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import Editor from 'website/components/editor.gts';
import { transform, type TransformResult } from 'svg2ember';
import { Form } from 'ember-primitives';
import { TrackedObject } from 'tracked-built-ins';

const INITIAL_CODE = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="48px" height="1px" viewBox="0 0 48 1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>Rectangle 5</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="19-Separator" transform="translate(-129.000000, -156.000000)" fill="#063855">
            <g id="Controls/Settings" transform="translate(80.000000, 0.000000)">
                <g id="Content" transform="translate(0.000000, 64.000000)">
                    <g id="Group" transform="translate(24.000000, 56.000000)">
                        <g id="Group-2">
                            <rect id="Rectangle-5" x="25" y="36" width="48" height="1"></rect>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;

export interface FullPlaygroundSignature {
  Element: HTMLDivElement;
  Args: object;
}

export default class FullPlayground extends Component<FullPlaygroundSignature> {
  constructor(owner: Owner, args: FullPlaygroundSignature['Args']) {
    super(owner, args);
    this.currentInputCode = INITIAL_CODE;
    this.doTheCodeConversion();
  }

  @tracked currentInputCode: string;
  @tracked currentOutputCode: string = '';
  options = new TrackedObject({
    typescript: false,
    optimize: true,
  });

  codeChangeHandler = (code: string) => {
    console.log('PLAYGROUND code change', code);
    this.currentInputCode = code;
    this.doTheCodeConversion();
  };

  doTheCodeConversion = () => {
    try {
      const result: TransformResult = transform(this.currentInputCode, {
        typescript: this.options.typescript,
        optimize: this.options.optimize,
        svgoConfig: {
          multipass: false,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
            'removeXMLNS',
          ],
        },
      });

      this.currentOutputCode = result.code;
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred during transformation.';
      if (err instanceof Error) {
        errorMessage = `Transformation Error: ${err.message}`;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      console.error(errorMessage);
      // TODO: more robust reporting here
      this.currentOutputCode = errorMessage;
    }
  };

  updateOptions = (
    newValues: { [s: string]: unknown } | ArrayLike<unknown>
  ) => {
    console.log('UPDATE OPTIONS CALLED', newValues);
    for (const [key, value] of Object.entries(newValues)) {
      if (
        this.options[key as keyof typeof this.options] !== value &&
        key in this.options
      ) {
        this.options[key as keyof typeof this.options] = value as boolean; // only update changed values
      }
    }
    // Re-run conversion when options change
    this.doTheCodeConversion();
  };

  <template>
    <div class="grid grid-cols-[min-content_1fr] gap-0.5" ...attributes>
      <div class="w-48">
        <div class="bg-accent border flex justify-between">
          <h3 class="text-xs px-1 uppercase font-semibold">Options</h3>
        </div>
        <div>
          <Form @onChange={{this.updateOptions}}>

            <fieldset class="fieldset w-full p-4">
              {{! <legend class="fieldset-legend">Options</legend> }}
              <label class="label">
                <input
                  type="checkbox"
                  checked={{this.options.typescript}}
                  class="checkbox"
                  name="typescript"
                />
                TypeScript
              </label>
              <label class="label">
                <input
                  type="checkbox"
                  checked={{this.options.optimize}}
                  class="checkbox"
                  name="optimize"
                />
                Optimize
              </label>
            </fieldset>
          </Form>
        </div>

      </div>
      <div class="grid grid-cols-2 gap-0.5 bg-base-300">
        <div
          class="grid grid-rows-[min-content_1fr]"
          data-input-editor-container
        >
          <div class="bg-accent border flex justify-between">
            <h3 class="text-xs px-1 uppercase font-semibold">SVG Input</h3>
          </div>
          <div class="bg-base-200 overflow-hidden">
            <Editor @code={{INITIAL_CODE}} @update={{this.codeChangeHandler}} />
          </div>
        </div>
        <div
          class="grid grid-rows-[min-content_1fr]"
          data-output-editor-container
        >
          <div class="bg-accent border flex justify-between">
            <h3 class="text-xs px-1 uppercase font-semibold">Component Output</h3>
          </div>
          <div class="bg-base-200 overflow-x-scroll">
            {{!-- <pre>{{this.currentOutputCode}}</pre> --}}
            <Editor @code={{this.currentOutputCode}} />

          </div>
        </div>
      </div>
    </div>
  </template>
}
