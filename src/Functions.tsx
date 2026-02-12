import type { Fachgebiet, Lang, HeaderKey, DictEntry} from "./type"
const sensitivity = 50;
export let VITE_FACHGEBIETE_JSON: Fachgebiet[] = [];
export let WOERTERBUCH_ERWEITERT: DictEntry[] = [];
let indexlist: Record<string, number[]> = {};
declare const __BUILD_ID__: string;

export async function init(): Promise<void> {
  const url = `${import.meta.env.BASE_URL}data/data.json?v=${__BUILD_ID__}`;
  const res = await fetch(url, { cache: "no-store" });
  
  if (!res.ok) throw new Error(`data.json HTTP ${res.status}: ${url}`);

  // Debug: Text aus Clone lesen, Original bleibt für json()
  const text = await res.clone().text();

  const raw: unknown = await res.json();
  const obj: any = Array.isArray(raw) ? raw[0] : raw;

  if (!obj || !Array.isArray(obj.words) || !Array.isArray(obj.categories)) {
    throw new Error(`data.json hat nicht die Struktur { words: [], categories: [] }`);
  }

  WOERTERBUCH_ERWEITERT = obj.words;
  VITE_FACHGEBIETE_JSON = obj.categories;

  indexlist = getIndexes();
}

export function getVITE_FACHGEBIETE_JSON():Fachgebiet[] {
  return VITE_FACHGEBIETE_JSON;
}

export function getWOERTERBUCH_ERWEITERT():DictEntry[]{
  return WOERTERBUCH_ERWEITERT;
}

function getIndexes() {
  const index: Record<string, number[]> = {};

  for (let i = 0; i < WOERTERBUCH_ERWEITERT.length; i++) {
    const element = WOERTERBUCH_ERWEITERT[i] as DictEntry;

    if (element.sourceIndex === undefined) {
      element.sourceIndex = i;
    }

    (index[getFachgebietKey(element.module)] ??= []).push(i);
  }

  return index;
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const distance = dp[a.length][b.length];
  const similarity = (1 - distance / Math.max(a.length, b.length)) * 100;
  return similarity;
}

export function getFachgebietLabel(moduleValue: string, targetLang: Lang){
  const v = moduleValue.trim().toLowerCase();

  const fach =
  VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.key.trim().toLowerCase() === v) ||
  VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.de.trim().toLowerCase() === v) ||
  VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.en.trim().toLowerCase() === v);

  return fach ? fach[targetLang] : moduleValue;
};

function getFachgebietKey(input:string):string{
  const v = input.trim().toLowerCase();
  if (!v) return "all";

  const fach:string = VITE_FACHGEBIETE_JSON.find((f: Fachgebiet) => f.key.trim().toLowerCase() === v)?.key ?? "all";
  return fach
}

function filterDict(input:string,category:string,lang:Lang){
  const result = new Set<typeof WOERTERBUCH_ERWEITERT[number]>();
  const normalized_input = input.trim().toLowerCase();
  const normalized_category = getFachgebietKey(category);
  let word:string;
  if (!normalized_input) return result;
  
  if(normalized_category == "all"){
    for(const entry of WOERTERBUCH_ERWEITERT){
      word = (lang === "de" ? entry.ger : entry.eng).trim().toLowerCase();

      if(levenshtein(normalized_input,word.slice(0,normalized_input.length)) > sensitivity) result.add(entry);
    }
  }else{
    const list = indexlist[normalized_category] ?? [];
    for(const entry of list){
      word = (lang === "de" ? WOERTERBUCH_ERWEITERT[entry].ger : WOERTERBUCH_ERWEITERT[entry].eng).trim().toLowerCase();

      if(levenshtein(normalized_input,word.slice(0,normalized_input.length)) > sensitivity) result.add(WOERTERBUCH_ERWEITERT[entry]);
    }
  }
  return result
}

export function search(
  eng: string,
  ger: string,
  fachgebietKey: string
){
  const result = new Set<typeof WOERTERBUCH_ERWEITERT[number]>();
  for (const r of filterDict(eng,fachgebietKey,"en")) result.add(r);
  for (const r of filterDict(ger,fachgebietKey,"de")) result.add(r);
  return Array.from(result);
}

export function changeLanguage(language:Lang,input:HeaderKey):string{
  const header_writings = {
    search: {"de":"Suche","en":"search"},
    install: {"de":"Installationsanleitung","en":"installation instructions"},
    search_en: {"de":"Englisch","en":"english"},
    search_de: {"de":"Deutsch","en":"german"},
    close: {"de":"schließen","en":"close"},
    title: {"de":"Wörterbuch","en":"Dictionary"},
  } as const;
  
  return header_writings[input][language]
}