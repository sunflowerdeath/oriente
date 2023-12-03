import React from "react";
declare const cloneElementWithRef: <T extends React.RefAttributes<T>>(elem: React.ReactElement<T, string | React.JSXElementConstructor<any>>, props: T, ...children: React.ReactElement[]) => React.ReactElement<T, string | React.JSXElementConstructor<any>>;
export default cloneElementWithRef;
