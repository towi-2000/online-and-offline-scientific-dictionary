import type { Dispatch, SetStateAction } from "react";

export type Lang = "de" | "en";
export type InstallHelp = "none" | "browser" | "ios";
export type Fachgebiet = { key: string; de: string; en: string };
export type DictEntry = { ger: string; eng: string; module: string; sourceIndex?: number };
export type DataFile = { categories: Fachgebiet[]; words: DictEntry[] };
export type HeaderKey = "search" | "install" | "search_en" | "search_de" | "close" | "title";
export type IndexList = Record<string, number[]>;
export type SetState<T> = Dispatch<SetStateAction<T>>;
export type FirefoxWindow = Window & { InstallTrigger?: unknown };

export type SelectionButtonsProps = {
  selectedFachgebietKey: string;
  setSelectedFachgebietKey: SetState<string>;
  lang: Lang;
};

export type InstallButtonProps = {
  lang: Lang;
  installHelp: InstallHelp;
  setInstallHelp: SetState<InstallHelp>;
};

export type SearchInputsProps = {
  searchValue_eng: string;
  searchValue_ger: string;
  setSearchValue_eng: SetState<string>;
  setSearchValue_ger: SetState<string>;
  lang: Lang;
};

export type LanguageFlagsProps = {
  lang: Lang;
  setLang: SetState<Lang>;
};

export type SelectLanguageDropdownProps = {
  language?: Lang;
  onChange: (lang: Lang) => void;
};

export type FachgebieteDropdownProps = {
  onSelect: (key: string) => void;
  language?: Lang;
  selectedKey: string;
};

export type OutputBoxProps = {
  results: DictEntry[];
};

export type FilteredOutputBoxProps = {
  results: DictEntry[];
  selectedFachgebietKey: string;
};

export type MobileLayoutProps = {
  searchValue_eng: string;
  searchValue_ger: string;
  setSearchValue_eng: SetState<string>;
  setSearchValue_ger: SetState<string>;
  lang: Lang;
  setLang: SetState<Lang>;
  results: DictEntry[];
  selectedFachgebietKey: string;
  setSelectedFachgebietKey: SetState<string>;
  setInstallHelp: SetState<InstallHelp>;
  installHelp: InstallHelp;
};

export type DesktopLayoutProps = MobileLayoutProps;