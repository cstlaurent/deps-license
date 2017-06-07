const os = require('os')

const licenseExtractor = require('./index')

test('Extract package list should return an array of packages', () => {
  let packages = licenseExtractor.extractPackageList('test-project')
  expect(packages).toBeInstanceOf(Array)
})

test('Extract package list to return 2 packages for production environment', () => {
  let packages = licenseExtractor.extractPackageList('test-project')
  expect(packages).toHaveLength(2)
})

test('Get project license should return package info object', () => {
  let packageInfo = licenseExtractor.getLicenseForPackage('./test-project', 'vue')
  expect(packageInfo).toBeInstanceOf(Object)
  expect(packageInfo.name).toBe('vue')
  expect(packageInfo.description).toBe('Reactive, component-oriented view layer for modern web interfaces.')
  expect(packageInfo.projectUrl).toBe('git+https://github.com/vuejs/vue.git')
  expect(packageInfo.license).toBe('MIT')
})

test('Get project license should return undefined when package do not exist', () => {
  let packageInfo = licenseExtractor.getLicenseForPackage('./test-project', 'do-not-exist')
  expect(packageInfo).toBeUndefined()
})

test('Print to CSV should output correct CSV string given 1 package license', () => {
  let versionInfo = {name: 'vue', description: 'desc', projectUrl: 'url', license: 'lic'}
  let text = licenseExtractor.printToCsvString([versionInfo])

  let result = `Name,Description,Project URL,License${os.EOL}`
  result += `"vue","desc","url","lic"${os.EOL}`

  expect(text).toBe(result)
})

test('Extract licences should output proper csv given valid package.json file', () => {
  let text = licenseExtractor.extractLicenses('test-project')

  // let result = `Name,Description,Project URL,License${os.EOL}`
  // result += `"vue","Reactive, component-oriented view layer for modern web interfaces.","git+https://github.com/vuejs/vue.git","MIT"${os.EOL}`
  // result += `"vue-router","Official router for Vue.js 2","git+https://github.com/vuejs/vue-router.git","MIT"${os.EOL}`

  expect(text).toBe('deps-license.csv')
})
