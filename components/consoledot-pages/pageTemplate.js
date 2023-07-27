import { useEffect, useMemo, useState } from "react";
import parseInternal from "@docs/parser/parserComponents";
import { Bullseye, Spinner } from "@patternfly/react-core";

const ParseDocs = () => {
  const [sourceCode, setSourceCode] = useState("");
  const Component = useMemo(
    () =>
      sourceCode ? (
        parseInternal(sourceCode)
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      ),
    [sourceCode]
  );
  useEffect(() => {
    import(`!raw-loader!@docs/consoledot-pages/@@html-path`).then((file) => {
      setSourceCode(file.default);
    });
  }, []);
  return Component;
};

export default ParseDocs;
