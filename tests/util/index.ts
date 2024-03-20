import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import type { VFileCompatible, Value } from "vfile";
import type { Paragraph, Code, Text } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm as gfmExt } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { find } from "unist-util-find";

import plugin, { CodeTitleOptions } from "../../src";

const compilerCreator = (options?: CodeTitleOptions) =>
  unified()
    .use(remarkParse)
    .use(gfm)
    .use(plugin, options)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify);

export const process = async (
  content: VFileCompatible,
  options?: CodeTitleOptions,
): Promise<Value> => {
  const vFile = await compilerCreator(options).process(content);

  return vFile.value;
};

/**
 * finds the AST node (Code) and the title node after processed via plugin
 * @param content string ;
 * @returns AST node (Code)
 */
export const processMDAST = (
  content: string,
  options?: CodeTitleOptions,
):
  | {
      title: string | null;
      lang: string | null | undefined;
      meta: string | null | undefined;
    }
  | undefined => {
  const tree = fromMarkdown(content, {
    extensions: [gfmExt()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  const code = find<Code>(tree, { type: "code" });

  if (!code) return;

  // @ts-expect-error
  plugin(options)(tree);

  const code_ = find<Code>(tree, { type: "code" });

  if (!code_) return;

  const lang = code_.lang;
  const meta = code_.meta;

  const titleNode = find<Paragraph>(tree, { type: "paragraph" })?.children[0];
  const title = titleNode ? (titleNode as Text).value : null;

  return { title, lang, meta };
};
