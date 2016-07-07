SystemJS.config({
  paths: {
    "github:*": "/base/jspm_packages/github/*",
    "npm:*": "/base/jspm_packages/npm/*"
  }
});
<% if (framework === 'angular2') { -%>
SystemJS.import('jspm.config.js').then(() => {
  return Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
  ]).then(providers => {
    const testing = providers[0];
    const testingBrowser = providers[1];

    testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
      testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
  });
});
<% } -%>
