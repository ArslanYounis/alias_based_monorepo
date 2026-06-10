/**
 * Manual mock for react-native-reanimated.
 *
 * reanimated v4 pulls in react-native-worklets, whose native module is not
 * initialized under jest (jest-expo) and throws a WorkletsError on import —
 * crashing any suite that transitively imports reanimated (Animated.View,
 * runOnJS, FadeIn/FadeOut wrappers, etc.). The library's own `/mock` entry
 * still requires the real index, so it does not help here.
 *
 * The codebase only uses a tiny surface (Animated.View, FadeIn, FadeOut,
 * runOnJS), so this lightweight mock is sufficient. Animated.View renders a
 * plain RN View; entering/exiting animation props are accepted and ignored.
 */
const React = require("react");
const { View } = require("react-native");

const passthroughView = React.forwardRef((props, ref) =>
  React.createElement(View, { ...props, ref }),
);

const Animated = {
  View: passthroughView,
  Text: passthroughView,
  ScrollView: passthroughView,
  Image: passthroughView,
  createAnimatedComponent: (Component) => Component,
};

// Entering/exiting animation builders are used only as opaque prop values
// (e.g. entering={FadeIn}); they need chainable no-op builder methods.
function makeAnimationBuilder() {
  const builder = {};
  const chain = () => builder;
  builder.duration = chain;
  builder.delay = chain;
  builder.springify = chain;
  builder.damping = chain;
  builder.withInitialValues = chain;
  builder.build = () => ({});
  return builder;
}

module.exports = {
  __esModule: true,
  default: Animated,
  FadeIn: makeAnimationBuilder(),
  FadeOut: makeAnimationBuilder(),
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  useSharedValue: (initial) => ({ value: initial }),
  useAnimatedStyle: () => ({}),
  useDerivedValue: (fn) => ({ value: typeof fn === "function" ? fn() : fn }),
  withTiming: (toValue) => toValue,
  withSpring: (toValue) => toValue,
  withDelay: (_, toValue) => toValue,
  withRepeat: (toValue) => toValue,
  cancelAnimation: () => {},
  interpolate: () => 0,
  Easing: new Proxy({}, { get: () => () => 0 }),
  // Used by react-native-gesture-handler's reanimated integration.
  useEvent: () => () => {},
  useHandler: () => ({ context: {}, doDependenciesDiffer: false }),
  useAnimatedGestureHandler: () => () => {},
  setGestureState: () => {},
};
