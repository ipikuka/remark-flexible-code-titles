import { it, expect } from "vitest";
import dedent from "dedent";

import { processMDAST } from "./util/index";

const fixture = dedent`
  :

   :
    :
  js
   js
  js:
   js:
  js :
   js :
  js:title
  js :title
  js: title
  js : title
  js{1,2}
  js {1,2}
  js { 1, 2  }
  js{ 1, 2}
  js{1 ,2}
  js{1 , 2 }
  js:title{1,2}
  js:title{ 1,2}
  js:title{1, 2  }
  js:title {1,2}
  js:title {1, 2  }
  js:title { 1, 2  }
  js :title{1,2}
  js :title{1 ,2 }
  js :title {1,2}
  js :title { 1 , 2 }
  js: title{1,2}
  js: title{1 ,2 }
  js: title {1,2}
  js: title { 1 , 2 }
  js : title{1,2}
  js : title{1 ,2 }
  js : title {1,2}
  js : title { 1 , 2 }
  js:title{1,2}showLineNumbers
  js:title{1,2} showLineNumbers
  js:title {1,2} showLineNumbers
  js:title { 1, 2} showLineNumbers
  js:title {1, 2}showLineNumbers
  js:{1,2}showLineNumbers
  js:{1,2} showLineNumbers
  js: {1,2} showLineNumbers
  js: { 1, 2} showLineNumbers
  js: {1, 2}showLineNumbers
  js :{1,2}showLineNumbers
  js :{1,2} showLineNumbers
  js : {1,2} showLineNumbers
  js : { 1, 2} showLineNumbers
  js : {1, 2}showLineNumbers
  js{1,2}showLineNumbers
  js{1,2} showLineNumbers
  js {1,2} showLineNumbers
  js { 1, 2} showLineNumbers
  js {1, 2}showLineNumbers
  js:showLineNumbers{1,2}
  js: showLineNumbers{1,2}
  js :showLineNumbers{1,2}
  js : showLineNumbers{1,2}
  js showLineNumbers {1,2}
  js showLineNumbers {1 , 2 }
  js:title showLineNumbers {1 , 2 }
  js :title showLineNumbers {1 , 2 }
  js : title showLineNumbers {1 , 2 }
  js :showLineNumbers {1 , 2 }
  js : showLineNumbers {1 , 2 }
  showLineNumbers{1,2}
  showLineNumbers {1 , 2 }
  {1,2}showLineNumbers
  {1 , 2}showLineNumbers
  showLineNumbers{1,2}:title
  showLineNumbers{1,2} : title
  showLineNumbers {1 , 2 }:title
  showLineNumbers {1 , 2 } :title
  {1,2}showLineNumbers:title
  {1,2}showLineNumbers : title
  {1 , 2}showLineNumbers:title
  {1, 2}showLineNumbers :  title
  js:long@title@with@space{1,2}showLineNumbers
  js:long@title@with@space {1,2} showLineNumbers
`;

it("parses the language, title and meta correctly", async () => {
  const result = fixture.split("\n").map((input) => ({
    _____: input,
    ...processMDAST("```" + input + "\n```", {
      tokenForSpaceInTitle: "@",
    }),
  }));

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "_____": ":",
        "_lang": null,
        "_meta": null,
        "title": null,
      },
      {
        "_____": "",
        "_lang": null,
        "_meta": null,
        "title": null,
      },
      {
        "_____": " :",
        "_lang": null,
        "_meta": null,
        "title": null,
      },
      {
        "_____": "  :",
        "_lang": null,
        "_meta": null,
        "title": null,
      },
      {
        "_____": "js",
        "_lang": "js",
        "_meta": null,
        "title": null,
      },
      {
        "_____": " js",
        "_lang": "js",
        "_meta": null,
        "title": null,
      },
      {
        "_____": "js:",
        "_lang": "js",
        "_meta": null,
        "title": null,
      },
      {
        "_____": " js:",
        "_lang": "js",
        "_meta": null,
        "title": null,
      },
      {
        "_____": "js :",
        "_lang": "js",
        "_meta": null,
        "title": null,
      },
      {
        "_____": " js :",
        "_lang": "js",
        "_meta": null,
        "title": null,
      },
      {
        "_____": "js:title",
        "_lang": "js",
        "_meta": null,
        "title": "title",
      },
      {
        "_____": "js :title",
        "_lang": "js",
        "_meta": null,
        "title": "title",
      },
      {
        "_____": "js: title",
        "_lang": "js",
        "_meta": null,
        "title": "title",
      },
      {
        "_____": "js : title",
        "_lang": "js",
        "_meta": null,
        "title": "title",
      },
      {
        "_____": "js{1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": null,
      },
      {
        "_____": "js {1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": null,
      },
      {
        "_____": "js { 1, 2  }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": null,
      },
      {
        "_____": "js{ 1, 2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": null,
      },
      {
        "_____": "js{1 ,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": null,
      },
      {
        "_____": "js{1 , 2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": null,
      },
      {
        "_____": "js:title{1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js:title{ 1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js:title{1, 2  }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js:title {1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js:title {1, 2  }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js:title { 1, 2  }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js :title{1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js :title{1 ,2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js :title {1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js :title { 1 , 2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js: title{1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js: title{1 ,2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js: title {1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js: title { 1 , 2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js : title{1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js : title{1 ,2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js : title {1,2}",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js : title { 1 , 2 }",
        "_lang": "js",
        "_meta": "{1,2}",
        "title": "title",
      },
      {
        "_____": "js:title{1,2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "js:title{1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "js:title {1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "js:title { 1, 2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "js:title {1, 2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "js:{1,2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js:{1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js: {1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js: { 1, 2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js: {1, 2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js :{1,2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js :{1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js : {1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js : { 1, 2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js : {1, 2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js{1,2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js{1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js {1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js { 1, 2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js {1, 2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js:showLineNumbers{1,2}",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "js: showLineNumbers{1,2}",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "js :showLineNumbers{1,2}",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "js : showLineNumbers{1,2}",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "js showLineNumbers {1,2}",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "js showLineNumbers {1 , 2 }",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "js:title showLineNumbers {1 , 2 }",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": "title",
      },
      {
        "_____": "js :title showLineNumbers {1 , 2 }",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": "title",
      },
      {
        "_____": "js : title showLineNumbers {1 , 2 }",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": "title",
      },
      {
        "_____": "js :showLineNumbers {1 , 2 }",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "js : showLineNumbers {1 , 2 }",
        "_lang": "js",
        "_meta": "showLineNumbers {1,2}",
        "title": null,
      },
      {
        "_____": "showLineNumbers{1,2}",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "showLineNumbers {1 , 2 }",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "{1,2}showLineNumbers",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "{1 , 2}showLineNumbers",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": null,
      },
      {
        "_____": "showLineNumbers{1,2}:title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "showLineNumbers{1,2} : title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "showLineNumbers {1 , 2 }:title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "showLineNumbers {1 , 2 } :title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "{1,2}showLineNumbers:title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "{1,2}showLineNumbers : title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "{1 , 2}showLineNumbers:title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "{1, 2}showLineNumbers :  title",
        "_lang": null,
        "_meta": "{1,2} showLineNumbers",
        "title": "title",
      },
      {
        "_____": "js:long@title@with@space{1,2}showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "long title with space",
      },
      {
        "_____": "js:long@title@with@space {1,2} showLineNumbers",
        "_lang": "js",
        "_meta": "{1,2} showLineNumbers",
        "title": "long title with space",
      },
    ]
  `);
});
