# remark-flexible-code-titles

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/remark-flexible-code-titles/graph/badge.svg?token=LJKU8SQ935)](https://codecov.io/gh/ipikuka/remark-flexible-code-titles)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Fremark-flexible-code-titles%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/remark-flexible-code-titles)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a [unified][unified] ([remark][remark]) plugin to add title or/and container for code blocks with customizable properties in markdown.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

This plugin is useful if you want to **add title and container or any of two** for code blocks in markdown. 

The plugin `remark-flexible-code-titles` can:

- add `title` node above the `code` node, providing _custom tag name, custom class name and also additional properties_.
- add `container` node for the `code` node, providing _custom tag name, custom class name and also additional properties_.
- correct the syntax of code highligting directives on behalf of related rehype plugins (like [rehype-prism-plus][rehypeprismplus])
- handle the titles even if there is no language provided,
- handle the titles composed by more than one word (handle spaces in the title),
- provide a fallback language as an option if the language is missing.

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

Say we have the following file, `example.md`, which consists a code block. The code block's language is "javascript" and its title is "file.js" specified _after a colon_ **`:`**

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

You can use the `remark-flexible-code-titles` **without a language**, _setting the title just after a colon_ **`:`**

````markdown
```:title
This is a line of pseudo code.
```
````

## Options

All options are **optional** and some of them have **default values**.

```tsx
type RestrictedRecord = Record<string, unknown> & { className?: never };
type PropertyFunction = (language?: string, title?: string) => RestrictedRecord;

use(remarkCodeTitles, {
  title?: boolean; // default is true
  titleTagName?: string; // default is "div"
  titleClassName?: string; // default is "remark-code-title"
  titleProperties?: PropertyFunction;
  container?: boolean; // default is true
  containerTagName?: string; // default is "div"
  containerClassName?: string; // default is "remark-code-container"
  containerProperties?: PropertyFunction;
  handleMissingLanguageAs?: string;
  tokenForSpaceInTitle?: string;
} as CodeTitleOptions);
```

#### `title`

It is a **boolean** option for whether or not to add a `title` node.

By default, it is `true`, meaningly adds a `title` node if a title is provided in the language part of the code block.

```javascript
use(remarkCodeTitles, {
  title: false,
});
```

If the option is `false`, the plugin will not add any `title` node.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<div class="remark-code-container">
  <!-- there is no title element ! -->
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `titleTagName`

It is a **string** option for providing custom HTML tag name for `title` nodes.

By default, it is `div`.

```javascript
use(remarkCodeTitles, {
  titleTagName: "span",
});
```

Now, the title element tag names will be `span`.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<div class="remark-code-container">
  <span class="remark-code-title">file.js</span>
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `titleClassName`

It is a **string** option for providing custom class name for `title` nodes.

By default, it is `remark-code-title`, and all title elements' class names will contain `remark-code-title`.

```javascript
use(remarkCodeTitles, {
  titleClassName: "custom-code-title",
});
```

Now, the title element class names will be `custom-code-title`.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<div class="remark-code-container">
  <div class="custom-code-title">file.js</div>
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `titleProperties`

It is a **callback** `(language?: string, title?: string) => Record<string, unknown> & { className?: never }` option to set additional properties for the `title` node.

The callback function that takes the `language` and the `title` as optional arguments and returns **object** which is going to be used for adding additional properties into the `title` node.

**The `className` key is forbidden and effectless in the returned object.**

```javascript
use(remarkCodeTitles, {
  titleProperties(language, title) {
    return {
      title,
      ["data-language"]: language,
    };
  },
});
```

Now, the title elements will contain `title` and `data-color` properties.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<div class="remark-code-container">
  <div class="remark-code-title" title="file.js" data-language="javascript">file.js</div>
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `container`

It is a **boolean** option for whether or not to add a `container` node.

By default, it is `true`, meaningly adds a `container` node.

```javascript
use(remarkCodeTitles, {
  container: false,
});
```

If the option is `false`, the plugin doesn't add any `container` node.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<!-- there is no container element ! -->
<div class="remark-code-title">file.js</div>
<pre>
  <code class="language-javascript">console.log("Hi")</code>
<pre>

```

#### `containerTagName`

It is a **string** option for providing custom HTML tag name for `container` nodes.

By default, it is `div`.

```javascript
use(remarkCodeTitles, {
  containerTagName: "section",
});
```

Now, the container element tag names will be `section`.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<section class="remark-code-container">
  <div class="remark-code-title">file.js</div>
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `containerClassName`

It is a **string** option for providing custom class name for `container` nodes.

By default, it is `remark-code-container`, and all container elements' class names will contain `remark-code-container`.

```javascript
use(remarkCodeTitles, {
  containerClassName: "custom-code-container",
});
```

Now, the container element class names will be `custom-code-container`.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<div class="custom-code-container">
  <div class="remark-code-title">file.js</div>
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `containerProperties`

It is a **callback** `(language?: string, title?: string) => Record<string, unknown> & { className?: never }` option to set additional properties for the `container` node.

The callback function that takes the `language` and the `title` as optional arguments and returns **object** which is going to be used for adding additional properties into the `container` node.

**The `className` key is forbidden and effectless in the returned object.**

```javascript
use(remarkCodeTitles, {
  titleProperties(language, title) {
    return {
      title,
      ["data-language"]: language,
    };
  },
});
```

Now, the container elements will contain `title` and `data-color` properties.

````markdown
```javascript:file.js
console.log("Hi")
```
````

```html
<div class="remark-code-container" title="file.js" data-language="javascript">
  <div class="remark-code-title">file.js</div>
  <pre>
    <code class="language-javascript">console.log("Hi")</code>
  <pre>
</div>
```

#### `handleMissingLanguageAs`

It is a **string** option for providing a fallback language if the language is missing.

```javascript
use(remarkCodeTitles, {
  handleMissingLanguageAs: "unknown",
});
```

Now, the class name of `<code>` elements will contain `language-unknown` if the language is missing. If this option was not set, the `class` property would not be presented in the `<code>`element.

````markdown
```
Hello from code block
```
````

```html
<div class="remark-code-container">
  <pre>
    <code class="language-unknown">Hello from code block</code>
  <pre>
</div>
```

#### `tokenForSpaceInTitle`

It is a **string** option for composing the title with more than one word.

Normally, the `remark-flexible-code-titles` can match a code title which is the word that comes after a colon and ends in the first space it encounters. This option is provided to replace a space with a token in order to specify a code title consisting of more than one word.

```javascript
use(remarkCodeTitles, {
  tokenForSpaceInTitle: "@",
});
```

Now, the titles that have more than one word can be set using the token `@`.

````markdown
```bash:Useful@Bash@Commands
mkdir project-directory
```
````

```html
<div class="remark-code-container">
  <div class="remark-code-title">Useful Bash Commands</div>
  <pre>
    <code class="language-bash">mkdir project-directory</code>
  <pre>
</div>
```

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
<span class="custom-code-title" data-language="javascript" title="file.js">file.js</span>
<pre>
  <code class="language-javascript">let me = "ipikuka";</code>
</pre>
```

#### Example for line highlighting and numbering

> [!NOTE]
> You need a rehype plugin like **rehype-prism-plus** for line highlighting and numbering features.

````markdown
```javascript:file.js {1,3-6} showLineNumbers
let me = "ipikuka";
```
````

The `remark-flexible-code-titles` takes the line highlighting and numbering syntax into consideration, and passes that information to other remark and rehype plugins.

But, if you want to highlight and number the lines **without specifying language**, you will get the language of the code block as for example `language-{2}` like strings. Let me give an example:

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
}
```

As a result, the html `code` element will have wrong language `language-{2}`:  
_(The class `code-highlight` in the `code` element is added by the rehype plugin `rehype-prism-plus`)_

```html
<code class="language-{2} code-highlight">...</code>
```

The `remark-flexible-code-titles` not only adds `title` and `container` elements but also **corrects the language** producing the below `mdast` which will lead the `<code>` element has accurate language or not have language as it sould be.

```json
{
  "type": "code",
  "lang": null,
  "meta": "{2} showLineNumbers"
}
```

```html
<code class="code-highlight">
  <!-- highlighted and numbered lines -->
</code>
```

If there is no space between the parts (_title, line range string and "showLineNumbers"_), or there is extra spaces inside the _line range string_, line highlighting or numbering features by the rehype plugin will not work. **The `remark-flexible-code-titles` can handles and corrects this kind of mis-typed situations**. 

````markdown
```typescript:title{ 1, 3 - 6 }showLineNumbers
content
```
````

There is mis-typed syntax in above markdown example; and without `remark-flexible-code-titles` will cause to produce the following `mdast`; and the rehype plugin not to work properly:

```json
{
  "type": "code",
  "lang": "typescript:title{",
  "meta": " 1, 3 - 6 }showLineNumbers"
}
```

The `remark-flexible-code-titles` will correct the syntax and ensure to produce the following `mdast` and `html`:

```json
{
  "type": "code",
  "lang": "typescript",
  "meta": "{1,3-6} showLineNumbers"
}
```

```html
<div class="remark-code-container">
  <div class="remark-code-title">title</div>
  <pre>
    <code class="language-typescript code-highlight">
      <!-- highlighted and numbered lines -->
    </code>
  </pre>
</div>
```

#### Example for providing a title without any language

You can provide a `title` without any language just using a colon **`:`** at the beginning.

````markdown
```:title
content
```
````

```html
<div class="remark-code-container">
  <div class="remark-code-title">title</div>
  <pre>
    <code>content</code>
  </pre>
</div>
```

### Another flexible usage

You can use `remark-flexible-code-titles` **just for only correcting language, line highlighting and numbering syntax** on behalf of related rehype plugins.

```javascript
use(remarkCodeTitles, {
  container: false,
  title: false,
});
```

Now, the `remark-flexible-code-titles` will not add any node, but will correct language, line highlighting and numbering syntax.

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
- [`rehype-highlight-code-lines`](https://www.npmjs.com/package/rehype-highlight-code-lines)
  – Rehype plugin to add line numbers to code blocks and allow highlighting of desired code lines
- [`rehype-code-meta`](https://www.npmjs.com/package/rehype-code-meta)
  – Rehype plugin to copy `code.data.meta` to `code.properties.metastring`

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.
- [`recma-mdx-change-imports`](https://www.npmjs.com/package/recma-mdx-change-imports)
  – Recma plugin to convert import declarations for assets and media with relative links into variable declarations with string URLs, enabling direct asset URL resolution in compiled MDX.
- [`recma-mdx-import-media`](https://www.npmjs.com/package/recma-mdx-import-media)
  – Recma plugin to turn media relative paths into import declarations for both markdown and html syntax in MDX.
- [`recma-mdx-import-react`](https://www.npmjs.com/package/recma-mdx-import-react)
  – Recma plugin to ensure getting `React` instance from the arguments and to make the runtime props `{React, jsx, jsxs, jsxDev, Fragment}` is available in the dynamically imported components in the compiled source of MDX.

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
