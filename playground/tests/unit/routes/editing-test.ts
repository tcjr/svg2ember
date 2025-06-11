import { module, test } from 'qunit';
import { setupTest } from 'playground/tests/helpers';

module('Unit | Route | editing', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:editing');
    assert.ok(route);
  });
});
