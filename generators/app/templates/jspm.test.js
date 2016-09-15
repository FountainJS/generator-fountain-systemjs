SystemJS.config({
  paths: {
    "github:*": "/base/jspm_packages/github/*",
    "npm:*": "/base/jspm_packages/npm/*"
<% if (framework === 'angular2') { -%>
  },
  map: {
    '@angular/core': 'npm:@angular/core@2.0.0-rc.6/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common@2.0.0-rc.6/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler@2.0.0-rc.6/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser@2.0.0-rc.6/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@2.0.0-rc.6/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http@2.0.0-rc.6/bundles/http.umd.js',
    '@angular/core/testing': 'npm:@angular/core@2.0.0-rc.6/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common@2.0.0-rc.6/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler@2.0.0-rc.6/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser@2.0.0-rc.6/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic@2.0.0-rc.6/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http@2.0.0-rc.6/bundles/http-testing.umd.js',
<% if (router === 'router') { -%>
    '@angular/router': 'npm:@angular/router@2.0.0-rc.2/bundles/router.umd.js',
    '@angular/router/testing': 'npm:@angular/router@2.0.0-rc.2/bundles/router-testing.umd.js'
<% } -%>
<% } -%>
  }
});
<% if (framework === 'angular2') { -%>
SystemJS.import('jspm.config.js').then(() => {
  return Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing'),
    System.import('@angular/common'),
    System.import('core-js/client/shim'),
    System.import('zone.js/dist/zone'),
    System.import('zone.js/dist/long-stack-trace-zone'),
    System.import('zone.js/dist/proxy'),
    System.import('zone.js/dist/async-test'),
    System.import('zone.js/dist/fake-async-test'),
    System.import('zone.js/dist/sync-test'),
    System.import('zone.js/dist/jasmine-patch'),
    System.import('reflect-metadata')
  ]).then(providers => {
    const testing = providers[0];
    const testingBrowser = providers[1];

    testing.TestBed.initTestEnvironment(testingBrowser.BrowserDynamicTestingModule,
      testingBrowser.platformBrowserDynamicTesting());
  });
});
<% } -%>
