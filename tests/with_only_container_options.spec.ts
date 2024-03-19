import dedent from "dedent";

import { type CodeTitleOptions } from "../src/index";

import { process } from "./util/index";

const options: CodeTitleOptions = {
  title: false,
  containerTagName: "vid",
  containerClassName: "remark-code-wrapper",
  containerProperties(language, title) {
    return {
      ["data-language"]: language,
      title,
    };
  },
};

describe("remark-flexible-code-title, without title, with container, using container options", () => {
  // ******************************************
  it("Considers there is no language or title", async () => {
    const input = dedent`
      \`\`\`
      const a = 1;
      \`\`\`
    `;

    // { type: 'code', lang: null, meta: null, parent: 'root' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper">
        <pre><code>const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Considers there is no language or title, but only colon", async () => {
    const input = dedent`
      \`\`\`:
      const a = 1;
      \`\`\`
    `;

    // { type: 'code', lang: ':', meta: null, parent: 'root' }  ==>> make the lang null

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper">
        <pre><code>const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Considers there is only the regular language", async () => {
    const input = dedent`
      \`\`\`js
      const a = 1;
      \`\`\`
    `;

    // { type: 'code', lang: 'js', meta: null, parent: 'root' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="js">
        <pre><code class="language-js">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles there is no title but colon", async () => {
    const input = dedent`
      \`\`\`js:
      const a = 1;
      \`\`\`
    `;

    // { type: 'code', lang: 'js:', meta: null, parent: 'root' } ==>> delete the colon in the lang

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="js">
        <pre><code class="language-js">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles there is no language but colon", async () => {
    const input = dedent`
      \`\`\`:title.js
      const a = 1;
      \`\`\`
    `;

    // ==>> make the lang null
    // { type: 'code', lang: ':title.js', meta: null, parent: 'root' } first visit
    // { type: 'code', lang: '', meta: null, parent: 'root' } second visit ==>> see the lang: null

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" title="title.js">
        <pre><code>const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles there is syntax mismatch, having one space around the colon", async () => {
    const input = dedent`
      \`\`\`js :    title.js   meta
      const a = 1;
      \`\`\`
    `;

    // little complex logic; meta starts with the colon, so remove the first word from meta, if this is not reserved
    // { type: 'code', lang: 'js', meta: ':    title.js   meta', parent: 'root' } ==>> little complex logic; remove title from meta

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="js" title="title.js">
        <pre><code class="language-js">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles there is syntax mismatch, having more space at the right of the colon", async () => {
    const input = dedent`
      \`\`\`js:    title.js    meta
      const a = 1;
      \`\`\`
    `;

    // ==>> nothing to do, there is no title, but remove the colon from the language at the end
    // { type: 'code', lang: 'js:', meta: 'title.js    meta', parent: 'root' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="js" title="title.js">
        <pre><code class="language-js">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles there is syntax mismatch, having more space at the both side of the colon", async () => {
    const input = dedent`
      \`\`\`js    :      title.js    meta
      const a = 1;
      \`\`\`
    `;

    // little complex logic; meta starts with the colon, so remove the first word from meta, if this is not reserved
    // { type: 'code', lang: 'js', meta: ':      title.js    meta', parent: 'root' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="js" title="title.js">
        <pre><code class="language-js">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles the regular language and the regular title", async () => {
    const input = dedent`
      \`\`\`js:title.js
      const a = 1;
      \`\`\`
    `;

    // { type: 'code', lang: 'js:title.js', meta: null, parent: 'root' } first visit
    // { type: 'code', lang: 'js', meta: null, parent: 'root' } second visit

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="js" title="title.js">
        <pre><code class="language-js">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles unknown language and the line range string within curly braces", async () => {
    const input = dedent`
      \`\`\`{2,    3   -   4,   5}         showLineNumbers  
      const a = 1;
      \`\`\`
    `;

    /*
      {
        type: 'code',
        lang: '{2',
        meta: '   3   -   4,   5}         showLineNumbers  ',
        parent: 'root'
      }
    */

    // { title: undefined, language: null, meta: '{2,3-4,5} showLineNumbers' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper">
        <pre><code>const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles the line range string within curly braces with language", async () => {
    const input = dedent`
      \`\`\`ts{2  , 3   -   4,   5}         showLineNumbers  
      const a = 1;
      \`\`\`
    `;

    /*
      {
        type: 'code',
        lang: 'ts{2',
        meta: ', 3   -   4,   5}         showLineNumbers  ',
        parent: 'root'
      }
    */

    // { title: undefined, language: 'ts', meta: '{2,3-4,5} showLineNumbers' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="ts">
        <pre><code class="language-ts">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });

  // ******************************************
  it("Handles the line range string within curly braces with language and title", async () => {
    const input = dedent`
      \`\`\`typescript:title{2  , 3   -   4,   5}         showLineNumbers  
      const a = 1;
      \`\`\`
    `;

    /*
      {
        type: 'code',
        lang: 'typescript{2',
        meta: ', 3   -   4,   5}         showLineNumbers  ',
        parent: 'root'
      }
    */

    // { title: undefined, language: 'typescript', meta: '{2,3-4,5} showLineNumbers' }

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <vid class="remark-code-wrapper" data-language="typescript" title="title">
        <pre><code class="language-typescript">const a = 1;
      </code></pre>
      </vid>
      "
    `);
  });
});
