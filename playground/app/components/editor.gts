import Component from '@glimmer/component';
import codeJarEditor from 'playground/modifiers/code-jar-editor.ts';

export interface EditorSignature {
  // The arguments accepted by the component
  Args: {
    code: string;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: HTMLDivElement;
}

export default class Editor extends Component<EditorSignature> {
  <template>
    <div ...attributes>
      HOWDY!
      <hr />
      <div {{codeJarEditor code=@code}}>
      </div>
      <hr />
    </div>
  </template>
}
