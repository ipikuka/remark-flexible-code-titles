import { visit, type Visitor } from "unist-util-visit";
import type { Plugin, Transformer } from "unified";
import type { Paragraph, Code, Root, Data, BlockContent, Parent } from "mdast";

// eslint-disable-next-line @typescript-eslint/ban-types
type Prettify<T> = { [K in keyof T]: T[K] } & {};

// eslint-disable-next-line @typescript-eslint/ban-types
type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

interface ContainerData extends Data {}

interface Container extends Parent {
  /**
   * Node type of mdast Mark.
   */
  type: "container";
  /**
   * Children of paragraph.
   */
  children: BlockContent[];
  /**
   * Data associated with the mdast paragraph.
   */
  data?: ContainerData | undefined;
}

declare module "mdast" {
  interface BlockContentMap {
    container: Container;
  }

  interface RootContentMap {
    container: Container;
  }
}

type StringOrNull = string | null;

type RestrictedRecord = Record<string, unknown> & { className?: never };
type PropertyFunction = (language?: string, title?: string) => RestrictedRecord;

export type CodeTitleOptions = {
  title?: boolean;
  titleTagName?: string;
  titleClassName?: string;
  titleProperties?: PropertyFunction;
  container?: boolean;
  containerTagName?: string;
  containerClassName?: string;
  containerProperties?: PropertyFunction;
  handleMissingLanguageAs?: string;
  tokenForSpaceInTitle?: string;
};

const DEFAULT_SETTINGS: CodeTitleOptions = {
  title: true,
  titleTagName: "div",
  titleClassName: "remark-code-title",
  container: true,
  containerTagName: "div",
  containerClassName: "remark-code-container",
};

type PartiallyRequiredCodeTitleOptions = Prettify<
  PartiallyRequired<
    CodeTitleOptions,
    | "title"
    | "titleTagName"
    | "titleClassName"
    | "container"
    | "containerTagName"
    | "containerClassName"
  >
>;

/**
 *
 * This plugin adds a title element before the code element, if the title exists in the markdown code block;
 * and wraps them in a container.
 *
 * for example:
 * ```javascript:title.js
 * // some js code
 * ```
 */
export const plugin: Plugin<[CodeTitleOptions?], Root> = (options) => {
  const settings = Object.assign(
    {},
    DEFAULT_SETTINGS,
    options,
  ) as PartiallyRequiredCodeTitleOptions;

  /** for creating mdx elements just in case (for archive)
  const titleNode = {
    type: "mdxJsxFlowElement",
    name: "div",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "className",
        value: "remark-code-title",
      },
      { type: "mdxJsxAttribute", name: "data-language", value: language },
    ],
    children: [{ type: "text", value: title }],
    data: { _xdmExplicitJsx: true },
  };

  const containerNode = {
    type: "mdxJsxFlowElement",
    name: "div",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "className",
        value: "remark-code-container",
      },
    ],
    children: [titleNode, node],
    data: { _xdmExplicitJsx: true },
  };
  */

  const constructTitle = (language: string, title: string): Paragraph => {
    let properties: Record<string, unknown> | undefined;

    if (settings.titleProperties) {
      properties = settings.titleProperties(language, title);

      Object.entries(properties).forEach(([k, v]) => {
        if (
          (typeof v === "string" && v === "") ||
          (Array.isArray(v) && (v as unknown[]).length === 0)
        ) {
          properties && (properties[k] = undefined);
        }

        if (k === "className") delete properties?.["className"];
      });
    }

    return {
      type: "paragraph",
      children: [{ type: "text", value: title }],
      data: {
        hName: settings.titleTagName,
        hProperties: {
          className: [settings.titleClassName],
          ...(properties && { ...properties }),
        },
      },
    };
  };

  const constructContainer = (
    children: BlockContent[],
    language: string,
    title: string,
  ): Container => {
    let properties: Record<string, unknown> | undefined;

    if (settings.containerProperties) {
      properties = settings.containerProperties(language, title);

      Object.entries(properties).forEach(([k, v]) => {
        if (
          (typeof v === "string" && v === "") ||
          (Array.isArray(v) && (v as unknown[]).length === 0)
        ) {
          properties && (properties[k] = undefined);
        }

        if (k === "className") delete properties?.["className"];
      });
    }

    return {
      type: "container",
      children,
      data: {
        hName: settings.containerTagName,
        hProperties: {
          className: [settings.containerClassName],
          ...(properties && { ...properties }),
        },
      },
    };
  };

  const extractLanguageAndTitle = (node: Code) => {
    const { lang: inputLang, meta: inputMeta } = node;

    if (!inputLang) {
      return { language: null, title: null, meta: null };
    }

    // we know that "lang" doesn't contain a space (gfm code fencing), but "meta" may consist.

    let title: StringOrNull = null;
    let language: StringOrNull = inputLang;
    let meta: StringOrNull = inputMeta ?? null;

    // move "showLineNumbers" into meta
    if (/showLineNumbers/.test(language)) {
      language = language.replace(/showLineNumbers/, "");

      meta = meta?.length ? meta + " showLineNumbers" : "showLineNumbers";
    }

    // move line range string like {1, 3-4} into meta (it may complete or nor)
    if (language.includes("{")) {
      const idxStart = language.search("{");
      const idxEnd = language.search("}");

      const metaPart =
        idxEnd >= 0
          ? language.substring(idxStart, idxEnd + 1)
          : language.slice(idxStart, language.length);

      language = language.replace(metaPart, "");

      meta = meta?.length ? metaPart + meta : metaPart;
    }

    // move colon+title into meta
    if (language.includes(":")) {
      const idx = language.search(":");
      const metaPart = language.slice(idx, language.length);

      language = language.slice(0, idx);

      meta = meta?.length ? metaPart + " " + meta : metaPart;
    }

    // another correctness for line ranges, removing all spaces within curly braces
    const RE = /{([\d\s,-]+)}/g; // finds {1, 2-4} like strings for line highlighting
    if (meta?.length && RE.test(meta)) {
      meta = meta.replace(RE, function (match) {
        return match.replace(/ /g, "");
      });
    }

    // correct if there is a non-space character before opening curly brace "{"
    meta = meta?.replace(/(?<=\S)\{/, " {") ?? null;

    // correct if there is a non-space character after closing curly brace "}"
    meta = meta?.replace(/\}(?=\S)/, "} ") ?? null;

    if (meta?.includes(":")) {
      const regex = /:\s*.*?(?=[\s{]|$)/; // to find :title with colon
      const match = meta?.match(regex);

      if (match) {
        const matched = match[0];
        title = matched.replace(/:\s*/, "");
        if (/^showLineNumbers$/i.test(title)) {
          title = null;
          meta = meta.replace(/:\s*/, "");
        } else {
          meta = meta.replace(matched, "");
        }
      }
    }

    // handle missing language
    if (
      !language &&
      settings.handleMissingLanguageAs &&
      typeof settings.handleMissingLanguageAs === "string"
    ) {
      language = settings.handleMissingLanguageAs;
    }

    // remove if there is more spaces in meta
    meta = meta?.replace(/\s+/g, " ").trim() ?? null;

    // employ the settings.tokenForSpaceInTitle
    if (title && settings.tokenForSpaceInTitle)
      title = title.replaceAll(settings.tokenForSpaceInTitle, " ");

    // if the title is empty, make it null
    if (title?.trim() === "") title = null;

    // if the language is empty, make it null
    if (language === "") language = null;

    // if the meta is empty, make it null
    if (meta === "") meta = null;

    return { title, language, meta };
  };

  const visitor: Visitor<Code> = function (node, index, parent) {
    /* istanbul ignore next */
    if (!parent || typeof index === "undefined") return;

    const { title, language, meta } = extractLanguageAndTitle(node);

    // mutating the parent.children may effect the next iteration causing visit the same node "code"
    // so, it is important to normalize the language here, otherwise may cause infinite loop
    node.lang = language;
    node.meta = meta;

    let titleNode: Paragraph | undefined = undefined;
    let containerNode: Container | undefined = undefined;

    if (settings.title && title) {
      titleNode = constructTitle(language ?? "", title);
    }

    if (settings.container) {
      containerNode = constructContainer(
        titleNode ? [titleNode, node] : [node],
        language ?? "",
        title ?? "",
      );
    }

    if (containerNode) {
      // 1 is for replacing the "code" with the container which consists it already
      parent.children.splice(index, 1, containerNode);
    } else if (titleNode) {
      // 0 is for inserting the titleNode before the "code"
      parent.children.splice(index, 0, titleNode);
    }
  };

  const transformer: Transformer<Root> = (tree) => {
    visit(tree, "code", visitor);
  };

  return transformer;
};

export default plugin;
