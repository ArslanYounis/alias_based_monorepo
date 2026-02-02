import { registerRootComponent } from 'expo';
import "./global.css";

import App from './src/app/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in a dev client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
