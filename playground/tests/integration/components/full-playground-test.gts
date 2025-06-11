import { module, test } from 'qunit';
import { setupRenderingTest } from 'playground/tests/helpers';
import { render } from '@ember/test-helpers';
import FullPlayground from 'playground/components/full-playground';

module('Integration | Component | full-playground', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Updating values is achieved using autotracking, just like in app code. For example:
    // class State { @tracked myProperty = 0; }; const state = new State();
    // and update using state.myProperty = 1; await rerender();
    // Handle any actions with function myAction(val) { ... };

    await render(<template><FullPlayground /></template>);

    assert.dom().hasText('');

    // Template block usage:
    await render(<template>
      <FullPlayground>
        template block text
      </FullPlayground>
    </template>);

    assert.dom().hasText('template block text');
  });
});
