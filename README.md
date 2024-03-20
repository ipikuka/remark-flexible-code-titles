# remark-flexible-code-titles

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![License][github-license]][github-license-url]
[![codecov](https://codecov.io/gh/ipikuka/remark-flexible-code-titles/graph/badge.svg?token=LJKU8SQ935)](https://codecov.io/gh/ipikuka/remark-flexible-code-titles)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Fremark-flexible-code-titles%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/remark-flexible-code-titles)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a [unified][unified] ([remark][remark]) plugin to add title or/and container for the code block with customizable properties in markdown.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

This plugin is useful if you want to **add title and container or any of two** for code blocks in markdown. 

The plugin `remark-flexible-code-titles` can:

- add `title` node above the `code` node, providing _custom tag name, custom class name and also additional properties_.
- add `container` node for the `code` node, providing _custom tag name, custom class name and also additional properties_.
- correct the syntax of code highligting directives on behalf of related rhype plugins (like [rehype-prism-plus][rehypeprismplus])
- handle the titles even if no language provided,
- handle the titles composed by more than one word (handle spaces in the title),
- support a fallback language as an option if the language is missing.

## Installation

This package is suitable for ESM only. In Node.js (16.0+), install with npm:

```bash
npm install remark-flexible-code-titles
```

or

```bash
yarn add remark-flexible-code-titles
```

## Usage

Say we have the following file, `example.md`, which consists a code block. The code block's language is "javascript" and its title is "file.js" specified _after a colon_ `:`

````markdown
```javascript:file.js
/* code block */
```
````

And our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import remark from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkCodeTitles from "remark-flexible-code-titles";

main();

async function main() {
  const file = await remark()
    .use(gfm)
    .use(remarkCodeTitles)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Now, running `node example.js` yields:

```html
<div class="remark-code-container">
  <div class="remark-code-title">title.js</div>
  <!-- <pre><code> elements -->
</div>
```

Without `remark-flexible-code-titles`, you’d get:

```html
<pre>
   <code class="language-javascript:file.js"><!-- code block --></code> 
</pre>
```

You can use the `remark-flexible-code-titles` plugin **without a language**, _setting the title just after a colon_ **`:`**

````markdown
```:title
This is a line of pseudo code.
```
````

## Options

All options are optional and have default values.

```javascript
use(remarkCodeTitles, {
  title: boolean, // optional, default is true
  titleTagName: string, // optional, default is "div"
  titleClassName: string, // optional, default is "remark-code-title"
  titleProperties: (language?: string, title?: string) => Record<string, unknown>, // optional, default is undefined
  container: boolean, // optional, default is true
  containerTagName: string, // optional, default is "div"
  containerClassName: string, // optional, default is "remark-code-container"
  containerProperties: (language?: string, title?: string) => Record<string, unknown>, // optional, default is undefined
  handleMissingLanguageAs: string, // optional, default is undefined
})
```

#### `title`

It is a **boolean** option for not adding any `title` node. If the option is provided as `false`, the plugin will not add the `title` node. Default is `true`, which adds a `title` node if a title is provided after a colon in the language part of the code block.

#### `titleTagName`

It is a **string** option for providing custom HTML tag name for the `title` node other than `div`.

#### `titleClassName`

It is a **string** option for providing custom className for the `title` node other than `remark-code-title` .

#### `titleProperties`

It is an option to set additional properties for the `title` node. It is a callback function that takes the `language` and the `title` as optional arguments and returns the object which is going to be used for adding additional properties into the `title` node.

#### `container`

It is a **boolean** option for not adding any `container` node. If the option is provided as `false`, the plugin will not add the `container` node. Default is `true`, which adds a `container` node.

#### `containerTagName`

It is a **string** option for providing custom HTML tag name for the `container` node other than `div`.

#### `containerClassName`

It is a **string** option for providing custom className for the `container` node other than `remark-code-container`.

#### `containerProperties`

It is an option to set additional properties for the `container` node. It is a callback function that takes the `language` and the `title` as optional arguments and returns the object which is going to be used for adding additional properties into the `container` node.

#### `handleMissingLanguageAs`

It is a **string** option for providing custom language if the language is missing.

#### `tokenForSpaceInTitle`

It is a **string** option for making the title up with more than one word.

## Examples:

#### Example for only container

````markdown
```javascript:file.js
let me = "ipikuka";
```
````

```javascript
use(remarkCodeTitles, {
  title: false,
  containerTagName: "section",
  containerClassName: "custom-code-wrapper",
  containerProperties(language, title) {
    return {
      ["data-language"]: language,
      title,
    };
  },
});
```

is going to produce the container `section` element like below:

```html
<section class="custom-code-wrapper" data-language="javascript" title="file.js">
  <pre>
    <code class="language-javascript">let me = "ipikuka";</code>
  </pre>
</section>
```

#### Example for only title

````markdown
```javascript:file.js
let me = "ipikuka";
```
````

```javascript
use(remarkCodeTitles, {
  container: false,
  titleTagName: "span",
  titleClassName: "custom-code-title",
  titleProperties: (language, title) => {
    ["data-language"]: language,
    title,
  },
});
```

is going to produce the title `span` element just before the code block, like below:

```html
<span class="custom-code-title" data-language="javascript" title="file.js">
  file.js
</span>
<pre>
  <code class="language-javascript">let me = "ipikuka";</code>
</pre>
```

#### Example for handling missing language

````markdown
```:filename
It is a line that does not related with any language.
```
````

```javascript
use(remarkCodeTitles, {
  container: false,
  handleMissingLanguageAs: "unknown",
});
```

is going to produce the title `span` element just before the code block, like below:

```html
<div class="remark-code-title">filename</div>
<pre>
  <code class="language-unknown">It is a line that does not related with any language.</code>
</pre>
```

#### Example for line highlighting and line numbering options (for example: using with _rehype-prism-plus_)

````markdown
```javascript:file.js {1, 3-6} showLineNumbers
let me = "ipikuka";
// the other codes...
```
````

Normally, the above markdown code will be parsed and rehyped as expected, with using _remark-flexible-code-titles_ for `the code title` and using the _rehype-prism-plus_ for `line highlighting and numbering`. But, if you want to highlight and number the lines **without specifying language**, you will get the language of the code block as forexample `language-{2}` like strings. Let me give an example:

````markdown
```{2} showLineNumbers
This is a line which is going to be numbered with rehype-prism-plus.
This is a line which is going to be highlighted and numbered with rehype-prism-plus.
```
````

The above markdown, with no language provided, will lead to produce a mdast "code" node as follows:

```json
{
  "type": "code",
  "lang": "{2}",
  "meta": "showLineNumbers"
  // other properties
}
```

As a result, the html `code` element will have wrong language `language-{2}`:  
_(The class attribute in the `code` element is added by the code highlighting plugin)_

```html
<code class="language-{2} code-highlight">...</code>
```

The job the `remark-flexible-code-titles` handles apart from providing code titles is **to correct the language** as well, producing the below `mdast` and as a result `code` element without language.

```json
{
  "type": "code",
  "lang": null,
  "meta": "{2} showLineNumbers"
  // other properties
}
```

```html
<code class="code-highlight">...highlighted and numbered lines...</code>
```

You can provide the `title` without any language just after a colon `:`

````markdown
```:title
lines...
```
````

Further, even if there is no space between the _title_ and the _line range string_, or giving any extra spaces inside the _line range string_ around the dash `-`, the `remark-flexible-code-titles` can handles this kind of **mis-typed situations**.

````markdown
```:title{ 1, 3 - 6 }
normally there should be one space between parts `language:title` and `{_line range string inside curly braces_}`
if there are spaces around the dash, the lines is not going to be highlighted
`remark-flexible-code-titles` solves this kind of mis-typed situations
```
````

With no problem, even if there is mis-typed syntax, the `remark-flexible-code-titles` with default options ensures to produce the following `mdast` and `html` for the above `markdown code block`:

```json
{
  "type": "code",
  "lang": null,
  "meta": "{1,3-6}"
  // other properties
}
```

```html
<div class="remark-code-container">
  <div class="remark-code-title">title</div>
  <pre>
    <code class="code-highlight">...highlighted lines as expected...</code>
  </pre>
</div>
```

### Another flexible usage:

You can use this plugin without providing _no title_, _no container_ with the options `{title: false, container: false}` just for only correcting the _line range strings_ and using this kind of parameters **if no language provided in markdown**. Hey, that is the flexibility this plugin's name comes from.

## Syntax tree

This plugin only modifies the mdast (markdown abstract syntax tree) as explained.

## Types

This package is fully typed with [TypeScript][typescript]. The plugin options' type is exported as `CodeTitleOptions`.

## Compatibility

This plugin works with `unified` version 6+ and `remark` version 7+. It is compatible with `mdx` version 2+.

## Security

Use of `remark-flexible-code-titles` does not involve rehype (hast) or user content so there are no openings for cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via Vfile.data or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [remark][remarknpm] 🟩 [remark plugin][remarkpluginnpm] 🟩 [mdast][mdastnpm] 🟩 [markdown][markdownnpm] 🟩 [remark code titles][remarkcodetitlesnpm]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[remarknpm]: https://www.npmjs.com/search?q=keywords:remark
[remarkpluginnpm]: https://www.npmjs.com/search?q=keywords:remark%20plugin
[mdastnpm]: https://www.npmjs.com/search?q=keywords:mdast
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[remarkcodetitlesnpm]: https://www.npmjs.com/search?q=keywords:remark%20code%20titles

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast
[micromark]: https://github.com/micromark/micromark
[typescript]: https://www.typescriptlang.org/
[rehypeprismplus]: https://github.com/timlrx/rehype-prism-plus

[badge-npm-version]: https://img.shields.io/npm/v/remark-flexible-code-titles
[badge-npm-download]: https://img.shields.io/npm/dt/remark-flexible-code-titles
[npm-package-url]: https://www.npmjs.com/package/remark-flexible-code-titles

[badge-license]: https://img.shields.io/github/license/ipikuka/remark-flexible-code-titles
[github-license-url]: https://github.com/ipikuka/remark-flexible-code-titles/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/remark-flexible-code-titles/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/remark-flexible-code-titles/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/remark-flexible-code-titles
[typescript-url]: https://www.typescriptlang.org/
