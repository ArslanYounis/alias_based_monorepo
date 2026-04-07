// Stub for expo/src/winter — prevents the lazy __ExpoImportMetaRegistry getter
// from being set up with a deferred require() call that jest-runtime rejects
// when isInsideTestCode === false (i.e., during the setup phase).
// In a unit test environment the expo import.meta polyfill is not needed.
if (typeof global.__ExpoImportMetaRegistry === 'undefined') {
  global.__ExpoImportMetaRegistry = { url: null };
}
