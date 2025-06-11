import type Owner from '@ember/owner';
import Modifier, {
  type ArgsFor,
  type NamedArgs,
  type PositionalArgs,
} from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { CodeJar } from 'codejar';
import { withLineNumbers } from 'codejar-linenumbers';
import Prism from 'prismjs';
import 'codejar-linenumbers/js/codejar-linenumbers.css';

interface CodeJarEditorSignature {
  Element: HTMLPreElement;
  Args: {
    Named: {
      code: string;
      codeChanged?: (updatedCode: string) => void;
    };
    //Positional: [];
  };
}

export default class CodeJarEditorModifier extends Modifier<CodeJarEditorSignature> {
  #isInstalled = false;
  #jar?: CodeJar;

  constructor(owner: Owner, args: ArgsFor<CodeJarEditorSignature>) {
    super(owner, args);
    registerDestructor(this, () => {
      // TODO: teardown
    });
  }

  modify(
    element: CodeJarEditorSignature['Element'],
    positional: PositionalArgs<CodeJarEditorSignature>,
    named: NamedArgs<CodeJarEditorSignature>
  ) {
    if (this.#isInstalled) {
      console.log('ALREADY INSTALLED');
    } else {
      this.#isInstalled = true;
      console.log('Setting up...', element);
      const jar = CodeJar(element, withLineNumbers(Prism.highlightElement));
      this.#jar = jar;
      console.log('jar is ', this.#jar);
      this.#jar.updateCode(named.code);
    }
  }
}
