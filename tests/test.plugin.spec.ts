import dedent from "dedent";

import { type CodeTitleOptions } from "../src/index";

import { process } from "./util/index";

const handleMissingLanguage: CodeTitleOptions = {
  handleMissingLanguageAs: "unknown",
};

const noContainer: CodeTitleOptions = { container: false };

const noTitle: CodeTitleOptions = { title: false };

const options: CodeTitleOptions = {
  titleTagName: "span",
  titleClassName: "custom-code-title",
  titleProperties(language, title) {
    return {
      ["data-language"]: language,
      title,
    };
  },
  containerTagName: "section",
  containerClassName: "custom-code-wrapper",
  containerProperties(language, title) {
    return {
      ["data-language"]: language,
      title,
    };
  },
};

describe("remark-flexible-code-title", () => {
  // ******************************************
  it("does nothing with code in paragraph", async () => {
    const input = dedent`
      \`Hi\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><code>Hi</code></p>
      "
    `);
  });

  // ******************************************
  it("considers there is no language or title, even if no coding phrase", async () => {
    const input = dedent`
      \`\`\`
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code></code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code></code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <pre><code></code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code></code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper">
        <pre><code></code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is no language or title", async () => {
    const input = dedent`
      \`\`\`
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <pre><code>const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper">
        <pre><code>const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is only language, no title", async () => {
    const input = dedent`
      \`\`\`javascript
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <pre><code class="language-javascript">const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper" data-language="javascript">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is no language but only title", async () => {
    const input = dedent`
      \`\`\`:title.js
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code class="language-unknown">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-title">title.js</div>
      <pre><code>const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper" title="title.js"><span class="custom-code-title" title="title.js">title.js</span>
        <pre><code>const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is a language and a title", async () => {
    const input = dedent`
      \`\`\`javascript:title.js
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-title">title.js</div>
      <pre><code class="language-javascript">const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper" data-language="javascript" title="title.js"><span class="custom-code-title" data-language="javascript" title="title.js">title.js</span>
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is no language or title when there is a syntax for line numbers", async () => {
    const input = dedent`
      \`\`\`{1,3-4} showLineNumbers
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-unknown">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <pre><code>const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper">
        <pre><code>const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is only language, no title when there is a syntax for line numbers", async () => {
    const input = dedent`
      \`\`\`javascript {1,3-4} showLineNumbers
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <pre><code class="language-javascript">const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper" data-language="javascript">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is no language but only title when there is a syntax for line numbers", async () => {
    const input = dedent`
      \`\`\`:title.js {1,3-4} showLineNumbers
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code class="language-unknown">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-title">title.js</div>
      <pre><code>const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code>const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper" title="title.js"><span class="custom-code-title" title="title.js">title.js</span>
        <pre><code>const a = 1;
      </code></pre>
      </section>
      "
    `);
  });

  // ******************************************
  it("considers there is a language and a title when there is a syntax for line numbers", async () => {
    const input = dedent`
      \`\`\`javascript:title.js {1,3-4} showLineNumbers
      const a = 1;
      \`\`\`
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, handleMissingLanguage)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <div class="remark-code-title">title.js</div>
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, noContainer)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-title">title.js</div>
      <pre><code class="language-javascript">const a = 1;
      </code></pre>
      "
    `);

    expect(await process(input, noTitle)).toMatchInlineSnapshot(`
      "
      <div class="remark-code-container">
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </div>
      "
    `);

    expect(await process(input, options)).toMatchInlineSnapshot(`
      "
      <section class="custom-code-wrapper" data-language="javascript" title="title.js"><span class="custom-code-title" data-language="javascript" title="title.js">title.js</span>
        <pre><code class="language-javascript">const a = 1;
      </code></pre>
      </section>
      "
    `);
  });
});
