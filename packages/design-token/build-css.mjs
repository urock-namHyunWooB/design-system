// CSS Variables 생성 스크립트
import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";
import fs from "fs";

console.log("🎨 Building CSS Variables...\n");

register(StyleDictionary);

const sd = new StyleDictionary({
  source: ["default-token.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
});

// build 폴더가 없으면 생성
if (!fs.existsSync("build")) {
  fs.mkdirSync("build", { recursive: true });
}
if (!fs.existsSync("build/css")) {
  fs.mkdirSync("build/css", { recursive: true });
}

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();

console.log("✅ CSS Variables generated at build/css/variables.css\n");
