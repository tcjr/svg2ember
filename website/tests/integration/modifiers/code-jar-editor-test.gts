import { module, test } from 'qunit';
import { setupRenderingTest } from 'website/tests/helpers';
import { render } from '@ember/test-helpers';
import codeJarEditor from 'website/modifiers/code-jar-editor.ts';

module('Integration | Modifier | code-jar-editor', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const code = `Here is some code to edit`;
    await render(
      <template>
        <pre {{codeJarEditor code=code}}></pre>
      </template>
    );

    assert.ok(true);
  });
});
