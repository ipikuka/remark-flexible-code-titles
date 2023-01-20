# remark-flexible-code-titles

This package is a [unified][unified] ([remark][remark]) plugin to add code titles in a flexible way (compatible with new parser "[micromark][micromark]").

"**unified**" is a project that transforms content with abstract syntax trees (ASTs). "**remark**" adds support for markdown to unified. "**mdast**" is the markdown abstract syntax tree (AST) that remark uses.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

This plugin is useful if you want to **add title** for the code blocks or **add container** for the code blocks or **both**. It is also usefull if you don't add a title or a container since it also **corrects the syntax of code highligting properties if no language provided**.

So, It is summarized the uses of this plugin;

- This plugin can add `title node` above the `code node`, providing _custom tag, custom class name and also additional properties_.
- This plugin can add `container node` for the `code node`, providing _custom tag, custom class name and also additional properties_.
- This plugin can add both `title node` and `container node` which contains the `title node` and the `code node`.
- This plugin corrects the syntax of code highligting properties (which the other plugins provide, like [rehype-prism-plus][rehypeprismplus]) if no language provided for the code blocks.

## Installation

This package is suitable for ESM and CommonJs module system. In Node.js (version 12.20+, 14.14+, or 16.0+), install with npm:

```bash
npm install remark-flexible-code-titles
```

## Usage

Say we have the following file, `example.md`, which consists a code block. The code block's language is "javascript" and its title is "file.js" specified after _a colon_ `:`

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

Normally, the above markdown code will be parsed and rehyped as expected, with using _this plugin_ for `the code title` and using the _rehype-prism-plus_ for **line highlighting and numbering**. But, if you want to highlight and number the lines **without specifying language**, you will get the language of the code block as forexample `language-{2}` like strings. Let me give an example:

````markdown
```{1, 3-6} showLineNumbers
This is a line is going to be highlighted and numbered with rehype-prism-plus.
This is another line with non-related code.
// the other lines...
```
````

The above markdown, with no language provided, will lead to produce a mdast "code" node as follows:

```json
{
  "type": "code",
  "lang": "{1,",
  "meta": "3-6} showLineNumbers"
  // other properties
}
```

As a result, the html `code` element will have wrong language:  
_(The class below in the `code` element is added by the code highlihting plugin that you use)_

```html
<code class="language-{1, code-highlight">...</code>
```

The job that this plugin (remark-flexible-code-titles) handles apart from providing code titles is **to correct the language** as well, producing the below `mdast` and as a result `code` element without language.

```json
{
  "type": "code",
  "lang": null,
  "meta": "{1,3-6} showLineNumbers"
  // other properties
}
```

```html
<code class="code-highlight">...highlighted and numbered lines...</code>
```

Further, you can provide the `code title` without any language just after a colon `:`, as well. Even if, there is no space between the title and the line range string, or giving any extra spaces inside the line range strings around the dash `-`. This plugin even handles this kind of mis-typed situations.

````markdown
```:title{ 1, 3 - 6 }
lines...
...
```
````

With no problem, this plugin (for example _with no options_) ensures to produce the following `mdast` and `html` for the above `markdown code block`:  
_(Of course, code highlighting will be handled by another remark/rehype plugin, like "rehype-prism-plus")_

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

**Another flexible usage:** You can use this plugin without providing _no title_, _no container_ with the options `{title: false, container: false}` just for only correcting the line range strings and using this kind of parameters if no language provided in markdown. Hey, that is the flexibility this plugin's name comes from :).

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

unified remark remark-plugin mdast markdown mdx "code blocks" "code titles"

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
[micromark]: https://github.com/micromark/micromark
[rehypeprismplus]: https://github.com/timlrx/rehype-prism-plus
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/remark-flexible-code-titles/blob/main/LICENSE
