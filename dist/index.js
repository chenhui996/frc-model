import React from 'react';

var Button = function () {
    return React.createElement(React.Fragment, null,
        React.createElement("button", { className: "frc-btn" },
            React.createElement("div", null, "123")));
};

var Input = function () {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "frc-input" },
            "input",
            React.createElement("input", { type: "text" })));
};

export { Button, Input };
