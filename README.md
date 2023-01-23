# remark-flexible-code-titles

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package is a [unified][unified] ([remark][remark]) plugin to add code titles in a flexible way (compatible with new parser "[micromark][micromark]").

"**unified**" is a project that transforms content with abstract syntax trees (ASTs). "**remark**" adds support for markdown to unified. "**mdast**" is the markdown abstract syntax tree (AST) that remark uses.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

This plugin is useful if you want to **add title** for the code blocks or **add container** for the code blocks or **both**. It is also usefull if you don't add a title or a container since it also **corrects the syntax of code highligting properties if no language provided**.

So, It is summarized the uses of this plugin;

- This plugin can add `title node` above the `code node`, providing _custom tag, custom class name and also additional properties_.
- This plugin can add `container node` for the `code node`, providing _custom tag, custom class name and also additional properties_.
- This plugin can add both `title node` and `container node` which contains the `title` and the `code`.
- This plugin corrects the syntax of code highligting properties (which the other plugins provide, like [rehype-prism-plus][rehypeprismplus]) if no language provided for the code blocks.

## Installation

This package is suitable for ESM and CommonJs module system. In Node.js (version 12.20+, 14.14+, or 16.0+), install with npm:

```bash
npm install remark-flexible-code-titles
```

or

```bash
yarn add remark-flexible-code-titles
```

## Usage

Say we have the following file, `example.md`, which consists a code block. The code block's language is "javascript" and its title is "file.js" specified  _after a colon_ `:`

````markdown
```javascript:file.js
let me = "ipikuka";
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
  <pre>
    <code class="language-javascript">let me = "ipikuka";</code>
  </pre>
</div>
```

Without `remark-flexible-code-titles`, you’d get:

```html
<pre>
  <code class="language-javascript:file.js">let me = "ipikuka";</code>
</pre>
```

You can use the `remark-flexible-code-titles` plugin **without language**, _setting the title just after a colon_ `:`

````markdown
```:title
This is a pseudo code line.
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
})
```

#### `title`

It is a **boolean** option for not adding any `title node`. If the option is provided as `false`, the plugin will not add the `title node`. Default is `true`, which adds a `title node` if a title is provided after a colon in the language part of the code block.

#### `titleTagName`

It is a **string** option for providing a custom HTML tag name for the `title node` other than `div`.

#### `titleClassName`

It is a **string** option for providing a custom className other than `remark-code-title` for the `title node`.

#### `titleProperties`

It is an option to set additional properties for the `title node`. It is a callback function that takes the `language` and the `title` as optional arguments and returns the object which is going to be used for adding additional properties into the `title node`.

#### `container`

It is a **boolean** option for not adding any `container node`. If the option is provided as `false`, the plugin will not add the `container node`. Default is `true`, which adds a `container node`.

#### `containerTagName`

It is a **string** option for providing a custom HTML tag name for the `container node` other than `div`.

#### `containerClassName`

It is a **string** option for providing a custom className other than `remark-code-container` for the `container node`.

#### `containerProperties`

It is an option to set additional properties for the `container node`. It is a callback function that takes the `language` and the `container` as optional arguments and returns the object which is going to be used for adding additional properties into the `container node`.

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

You can use this plugin without providing _no title_, _no container_ with the options `{title: false, container: false}` just for only correcting the _line range strings_ and using this kind of parameters **if no language provided in markdown**. Hey, that is the flexibility this plugin's name comes from :).

## Syntax tree

This plugin only modifies the mdast (markdown abstract syntax tree) as explained.

## Types

This package is fully typed with [TypeScript][typeScript]. The plugin options' type is exported as `CodeTitleOptions`.

## Compatibility

This plugin works with unified version 6+ and remark version 7+. It is compatible with mdx version.2.

## Security

Use of `remark-flexible-code-titles` does not involve rehype (hast) or user content so there are no openings for cross-site scripting (XSS) attacks.

## License

[MIT][license] © ipikuka

### Keywords

[unified][unifiednpm] [remark][remarknpm] [remark-plugin][remarkpluginnpm] [mdast][mdastnpm] [markdown][markdownnpm] [remark code titles][remarkcodetitlesnpm]

[unified]: https://github.com/unifiedjs/unified
[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[remark]: https://github.com/remarkjs/remark
[remarknpm]: https://www.npmjs.com/search?q=keywords:remark
[remarkpluginnpm]: https://www.npmjs.com/search?q=keywords:remark%20plugin
[mdast]: https://github.com/syntax-tree/mdast
[mdastnpm]: https://www.npmjs.com/search?q=keywords:mdast
[micromark]: https://github.com/micromark/micromark
[rehypeprismplus]: https://github.com/timlrx/rehype-prism-plus
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/remark-flexible-code-titles/blob/main/LICENSE
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[remarkcodetitlesnpm]: https://www.npmjs.com/search?q=keywords:remark%20code%20titles
[npm-url]: https://www.npmjs.com/package/remark-flexible-code-titles
[npm-image]: https://img.shields.io/npm/v/remark-flexible-code-titles
[github-license]: https://img.shields.io/github/license/ipikuka/remark-flexible-code-titles
[github-license-url]: https://github.com/ipikuka/remark-flexible-code-titles/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/remark-flexible-code-titles/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/remark-flexible-code-titles/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/remark-flexible-code-titles