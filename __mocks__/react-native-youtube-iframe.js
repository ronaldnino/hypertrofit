// Mock de react-native-youtube-iframe para Jest (depende de react-native-webview, que es
// ESM y no existe en el entorno de test). Renderiza un View simple.
const React = require('react');
const {View} = require('react-native');

const YoutubePlayer = props => React.createElement(View, props, props.children);

module.exports = YoutubePlayer;
module.exports.default = YoutubePlayer;
