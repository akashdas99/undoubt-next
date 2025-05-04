"use client";
import parse, {
  DOMNode,
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";

const TextEditorContent = ({ content }: { content: string }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element) {
        if (domNode?.attribs && domNode?.name === "ol") {
          return (
            <ol className="list-decimal ml-5">
              {domToReact(domNode.children as DOMNode[])}
            </ol>
          );
        }
      }
    },
  };
  return <div>{parse(content, options)}</div>;
};

export default TextEditorContent;
