import React from "react";
import "./styles.css";
import { serializeStyles } from "@emotion/serialize";
import { StyleSheet } from "@emotion/sheet";
import { serialize, compile, middleware, rulesheet, stringify } from "stylis";

function injectGlobal(...args) {
  const { name, styles } = serializeStyles(...args);
  const sheet = new StyleSheet({
    key: `global-${name}`,
    container: document.head
  });
  const stylis = (styles) =>
    serialize(
      compile(styles),
      middleware([
        stringify,
        rulesheet((rule) => {
          sheet.insert(rule);
        })
      ])
    );
  stylis(styles);
  return () => sheet.flush();
}

const Global = ({ styles }) => {
  React.useEffect(() => {
    const removeStyles = injectGlobal(styles);
    return () => removeStyles();
  }, [styles]);
  return null;
};

export default function App() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <button onClick={() => setOpen((v) => !v)} type="button">
        Click
      </button>
      {open && (
        <Global
          styles={`
          * {
            color: hotpink;
          }
          button {
            // cursor: not-allowed;
            // pointer-events: none;
          }
          `}
        />
      )}
    </div>
  );
}
