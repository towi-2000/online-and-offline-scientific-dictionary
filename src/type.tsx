export type Lang = "de" | "en";
export type InstallHelp = "none" | "browser" | "ios";
export type Fachgebiet = { key: string; de: string; en: string };
export type DataFile = { categories: Fachgebiet[]; words: DictEntry[] };
export type HeaderKey = "search" | "install" | "search_en" | "search_de" | "close" | "title";
export type DictEntry = { ger: string; eng: string; module: string; sourceIndex: number; }
export type InstallUiAction =
  | { type: "PROMPT_AVAILABLE" }
  | { type: "ALREADY_INSTALLED" }
  | { type: "SHOW_IOS_INSTRUCTIONS" }
  | { type: "SHOW_ANDROID_INSTRUCTIONS"}
  | { type: "SHOW_BROWSER_INSTRUCTIONS"; text: string };