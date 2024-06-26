import hljs from "highlight.js";

export const RELEVANCE_THRESHOLD = 10;

export const highlight = (text: string) =>
  hljs.highlightAuto(text, allowedLanguages);

const allowedLanguages = [
  "xml",
  "bash",
  "basic",
  "c",
  "cmake",
  "coffeescript",
  "cpp",
  "crystal",
  "csharp",
  "css",
  "markdown",
  "dart",
  "delphi",
  "diff",
  "dockerfile",
  "ruby",
  "fortran",
  "fsharp",
  "go",
  "gradle",
  "graphql",
  "groovy",
  "haskell",
  "ini",
  "java",
  "javascript",
  "json",
  "kotlin",
  "less",
  "lisp",
  "lua",
  "makefile",
  "matlab",
  "perl",
  "nginx",
  "objectivec",
  "php",
  "plaintext",
  "powershell",
  "python",
  "python-repl",
  "rust",
  "scala",
  "scss",
  "shell",
  "sql",
  "swift",
  "yaml",
  "typescript",
  "vbscript",
  "vim",
];
