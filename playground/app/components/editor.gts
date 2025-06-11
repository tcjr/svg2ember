import Component from '@glimmer/component';
import codeJarEditor from 'playground/modifiers/code-jar-editor.ts';

export interface EditorSignature {
  // The arguments accepted by the component
  Args: {
    code: string;
    update?: (code: string) => void;
  };
  // The element to which `...attributes` is applied in the component template
  Element: HTMLDivElement;
}

export default class Editor extends Component<EditorSignature> {
  onCodeChange = (updatedCode) => {
    console.log('[editor component] code changed!', updatedCode);
    this.args.update?.(updatedCode);
  };

  <template>
    <div ...attributes>
      <pre {{codeJarEditor code=@code codeChanged=this.onCodeChange}}></pre>
    </div>
  </template>
}
