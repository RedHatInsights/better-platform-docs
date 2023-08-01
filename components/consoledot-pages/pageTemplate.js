import { useMemo } from "react";
import parseInternal from "@docs/parser/parserComponents";
import HTMLTemplate from "!raw-loader!@docs/consoledot-pages/@@html-path";

const ParseDocs = () => {
  const Component = useMemo(() => parseInternal(HTMLTemplate), [HTMLTemplate]);
  return Component;
};

export default ParseDocs;
