import React from "react";

import mergeRefs from "./mergeRefs";

const cloneElementWithRef = <T>(
  elem: React.ReactElement<T>,
  props: T,
  ...children: React.ReactElement[]
) =>
  React.cloneElement(
    elem,
    // @ts-ignore
    { ...props, ref: mergeRefs(props.ref, (elem as any).ref) },
    ...children,
  );

export default cloneElementWithRef;
