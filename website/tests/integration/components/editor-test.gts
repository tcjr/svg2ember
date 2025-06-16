import { module, test } from 'qunit';
import { setupRenderingTest } from 'website/tests/helpers';
import { render } from '@ember/test-helpers';
import Editor from 'website/components/editor';

module('Integration | Component | editor', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const codeIn = `Here is some code to edit`;

    await render(<template><Editor @code={{codeIn}} /></template>);

    assert.dom().includesText('Here is some code to edit');
  });
});
