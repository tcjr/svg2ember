import EmberRouter from '@ember/routing/router';
import config from 'website/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('playground');
  this.route('compare');
  this.route('docs', function () {
    this.route('cli');
    this.route('core');
    this.route('vite');
  });
});
