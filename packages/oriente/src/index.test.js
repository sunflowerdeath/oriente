// Require all files from dir '__tests__'
var context = require.context('./', true, /__tests__/)
context.keys().forEach(context)
