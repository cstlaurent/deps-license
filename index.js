const fs = require('fs')
const path = require('path')
const os = require('os')

function extractPackageList (projectPath) {
  let projectJsonPath = path.join(projectPath, 'package.json')
  let fileContent = fs.readFileSync(projectJsonPath)
  let jsonContent = JSON.parse(fileContent)
  if (jsonContent && jsonContent.dependencies) {
    return Object.keys(jsonContent.dependencies)
  }
  return []
}

function getLicenseForPackage (projectPath, packageName) {
  let projectJsonPath = path.join(projectPath, 'node_modules', packageName, 'package.json')
  let fileContent
  try {
    fileContent = fs.readFileSync(projectJsonPath)
  } catch (error) {
    console.log('Requested file do not exist')
    return undefined
  }
  let jsonContent = JSON.parse(fileContent)

  let projectUrl = ''

  if (typeof (jsonContent.repository) === 'string') {
    projectUrl = jsonContent.repository
  } else if (typeof (jsonContent.repository) === 'object' && jsonContent.repository.url) {
    projectUrl = jsonContent.repository.url
  }

  let license = 'None'

  if (jsonContent.license) {
    license = jsonContent.license
  } else if (jsonContent.licenses) {
    license = jsonContent.licenses[0].type || 'None'
  }

  return {
    name: jsonContent.name,
    description: jsonContent.description,
    projectUrl: projectUrl,
    license: license
  }
}

function printToCsvString (licenses) {
  let text = ''
  text += `Name,Description,Project URL,License${os.EOL}`
  licenses.forEach(function (l) {
    text += `"${l.name}","${l.description}","${l.projectUrl}","${l.license}"${os.EOL}`
  }, this)

  return text
}

function writeCsvToFile (csvString, path) {
  let filePath = 'deps-license.csv'
  fs.writeFileSync(filePath, csvString)
  return filePath
}

function extractLicenses (projectPath) {
  let packages = extractPackageList(projectPath)
  let licensesInfo = packages.map((p) => {
    return getLicenseForPackage(projectPath, p)
  })

  let text = printToCsvString(licensesInfo)
  return writeCsvToFile(text)
}

module.exports = {
  extractPackageList,
  getLicenseForPackage,
  printToCsvString,
  writeCsvToFile,
  extractLicenses
}
