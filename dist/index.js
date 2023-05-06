import React from 'react';

var Button = function () {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "frc-btn" },
            React.createElement("div", null, "button"),
            React.createElement("button", null, "456")));
};

var Input = function () {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "frc-input" },
            React.createElement("div", null, "input"),
            React.createElement("input", { type: "text" })));
};

export { Button, Input };
