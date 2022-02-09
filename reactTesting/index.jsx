const ReactDom = require("react-dom");
const React = require("react");

const header = React.createElement(
    "h1",
    null,
    "Inventory Contents"
);

const App = React.createElement("div", null, header);

ReactDom.render(App, document.getElementById("app"));