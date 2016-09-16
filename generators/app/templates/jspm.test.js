SystemJS.config({
  paths: {
    "github:*": "/base/jspm_packages/github/*",
    "npm:*": "/base/jspm_packages/npm/*"
  }
});
<% if (framework === 'angular2') { -%>

var angularLoaded = false;
var karmaLoaded = false;

__karma__.originalLoaded = __karma__.loaded;
__karma__.loaded = function () {
  karmaLoaded = true;
  syncStart();
};

function syncStart () {
  if (angularLoaded && karmaLoaded) {
    __karma__.originalLoaded();
  }
}

SystemJS.import('jspm.config.js')
  .then(() => System.import('reflect-metadata'))
  .then(() => System.import('core-js/client/shim'))
  .then(() => System.import('zone.js/dist/zone'))
  .then(() => {
    return Promise.all([
      System.import('zone.js/dist/long-stack-trace-zone'),
      System.import('zone.js/dist/proxy'),
      System.import('zone.js/dist/async-test'),
      System.import('zone.js/dist/fake-async-test'),
      System.import('zone.js/dist/sync-test'),
      System.import('zone.js/dist/jasmine-patch'),
      System.import('@angular/common')
    ]);
  }).then(() => {
    return Promise.all([
      System.import('@angular/core/testing'),
      System.import('@angular/platform-browser-dynamic/testing')
    ]);
  }).then(providers => {
    const testing = providers[0];
    const testingBrowser = providers[1];

    testing.TestBed.initTestEnvironment(
      testingBrowser.BrowserDynamicTestingModule,
      testingBrowser.platformBrowserDynamicTesting()
    );

    angularLoaded = true;
    syncStart();
  });
<% } -%>
