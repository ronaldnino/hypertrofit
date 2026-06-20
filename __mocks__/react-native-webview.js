// Mock de react-native-webview para Jest (el paquete se publica como ESM y el módulo
// nativo no existe en el entorno de test). Renderiza un View simple.
const React = require('react');
const {View} = require('react-native');

const WebView = props => React.createElement(View, props, props.children);

module.exports = {WebView};
module.exports.default = WebView;
