//Datei, um die responsive Oberfläche zu organisiseren. Die einzelnen Anzeigeelemente sind in Komponenten aufgeteilt, um
//eine bessere Modularisierung zu erreichen. Die einzelnen Funktionen sind unten erklärt.
import "./responsive.css"
import type { Lang, InstallHelp, Fachgebiet, DictEntry } from "./type"
import { VITE_FACHGEBIETE_JSON, search, changeLanguage, getFachgebietLabel, init } from './Functions'
import { useEffect, useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { installFunction, ZeigeAnleitung, ZeigeAnleitung_IOS } from './installFunction';
import gerFlag from "./images/germany_flag.png"
import engFlag from "./images/us_flag.png"

//stellt die Buttons für die Auswahl des Fachgebietes dar (nur Browserversion)
function SelectionButtons({
        setSelectedFachgebietKey,
        selectedFachgebietKey,
        lang
    }:{
        selectedFachgebietKey: string;
        setSelectedFachgebietKey: React.Dispatch<React.SetStateAction<string>>;
        lang:Lang;
    }){
    const handleButtonAction = (input:string) => {
        setSelectedFachgebietKey(input);
    };

    return(
        <div className='fachgebiete'>
            {VITE_FACHGEBIETE_JSON.map((f:Fachgebiet) => (
                <button
                key={f.key}
                className= {"categorystyle" + (selectedFachgebietKey === f.key ? " active" : "")}
                onClick={() => handleButtonAction(f.key)}
                >
                {lang === "de" ? f.de : f.en}
                </button>
            ))}
        </div>
    )
}

//stellt den Installationsbuton dar (beide Versionen)
function InstallButton({
  lang,
  setInstallHelp,
  installHelp,
}: {
  lang: Lang;
  installHelp: InstallHelp;
  setInstallHelp: React.Dispatch<React.SetStateAction<InstallHelp>>;
}) {
  function installHandler() {
    const result = installFunction(lang);
    setInstallHelp(result);
  }

  const overlayOpen = installHelp === "browser" || installHelp === "ios";

  return (
    <>
      {overlayOpen && (
        <div className="installOverlay">
          <div className="installOverlayCard">
            {installHelp === "browser" && <ZeigeAnleitung lang={lang} />}
            {installHelp === "ios" && <ZeigeAnleitung_IOS lang={lang} />}

            <button
              type="button"
              className="buttonstyle"
              onClick={() => setInstallHelp("none")}
            >
              {changeLanguage(lang, "close")}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="installBtn buttonstyle"
        onClick={installHandler}
      >
        {changeLanguage(lang, "install")}
      </button>
    </>
  );
}

//stellt die Eingabefelder für die Suche dar (beide Versionen)
function SearchInputs({
    searchValue_eng,
    searchValue_ger,
    setSearchValue_eng,
    setSearchValue_ger,
    lang
}:{
    setSearchValue_eng:React.Dispatch<React.SetStateAction<string>>;
    setSearchValue_ger:React.Dispatch<React.SetStateAction<string>>;
    lang:Lang;
    searchValue_eng:string;
    searchValue_ger:string;
}){
    const handleEngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue_eng(e.target.value);
    };

        const handleGerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue_ger(e.target.value);
    };
    
    return(
        <div className="searchInput">
            <input
                type="text"
                placeholder={changeLanguage(lang,"search_en")}
                value={searchValue_eng}
                onChange={handleEngChange}
                // onKeyDown={handleKeyDown}
                className='searchStyle'
            />
            <input
                type="text"
                placeholder={changeLanguage(lang,"search_de")}
                value={searchValue_ger}
                onChange={handleGerChange}
                // onKeyDown={handleKeyDown}
                className='searchStyle'
            />
        </div>
    )
}

//stellt die Buttons für die Sprachauswahl dar (nur Browserversion). Die Buttons werden mit Flaggen versehen.
export function LanguageFlags({
    setLang,
    lang,
}:{
    lang:Lang;
    setLang: React.Dispatch<React.SetStateAction<Lang>>;
}){
    const handleLanguageSelection = (fachKey: Lang) => {
        setLang(fachKey);
    }

    return(
        <div className='flag-box'>
            <button className={"flag-buttons" + (lang === "de" ? " active" : "")} onClick={() => handleLanguageSelection("de")}>
                <img src = {gerFlag} alt="ger" className = 'flag-img'/>
            </button>
            <button className={"flag-buttons" + (lang === "en" ? " active" : "")} onClick={() => handleLanguageSelection("en")}>
                <img src = {engFlag} alt="eng" className = 'flag-img'/>
            </button>
        </div>
    )
}

//stellt das Dropdownmenü für die Sprachauswahl dar (nur mobile Version)
function SelectLanguageDropdown({
    language = "de",onChange
}:{
    language:Lang;
    onChange:(lang:Lang) => void;
}){
  return (
    <Dropdown className='language-menu' align="end">
      <Dropdown.Toggle variant="" id="dropdown-basic">
        {language === "de" ? "Deutsch" : "English"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onChange("de")}>Deutsch</Dropdown.Item>
        <Dropdown.Item onClick={() => onChange("en")}>English</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

//stellt das Dropdownmenü für die Auswahl des Fachgebietes dar (nur mobile Version)
function FachgebieteDropdown({
    onSelect,
    language = "de",
    selectedKey,
}:{
    onSelect:(key: string) => void;
    language:Lang;
    selectedKey:string;
}){
    const selectedLabel = VITE_FACHGEBIETE_JSON.find((item) => item.key === selectedKey)?.[language] ?? (language === "de" ? "Alle" : "All");

  return (
    <Dropdown className='fachgebiete-menu'>
      <Dropdown.Toggle variant="">
        {selectedLabel}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {VITE_FACHGEBIETE_JSON.map((item) => (
          <Dropdown.Item
            key={item.key}
            active={item.key === selectedKey}
            onClick={() => {onSelect(item.key)}
        }
          >
            {item[language]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

//stellt die Box für die Ausgabe der Ergebnisse dar (beide Versionen)
function OutputBox({ results }: { results: DictEntry[] }) {
  return (
    <div className="outputbox">
      {results.map((item) => (
        <div className="outputrow" key={item.sourceIndex}>
          <div className="outputcell">
            <span>{item.ger}{" "}</span>
            <span className="outputmodule">[{getFachgebietLabel(item.module, "de")}]</span>
          </div>
          <div className="outputcell">
            <span>{item.eng}{" "}</span>
            <span className="outputmodule">[{getFachgebietLabel(item.module, "en")}]</span>
          </div>
        </div>
      ))}
    </div>
  );
}

//fügt die oben genannten Komponenten zu einem mobilen Layout zusammen
function MobileLayout({
    searchValue_eng,
    searchValue_ger,
    setSearchValue_eng,
    setSearchValue_ger,
    lang,
    setLang,
    results,
    selectedFachgebietKey,
    setSelectedFachgebietKey,
    setInstallHelp,
    installHelp,
}:{
    setSearchValue_eng:React.Dispatch<React.SetStateAction<string>>;
    setSearchValue_ger:React.Dispatch<React.SetStateAction<string>>;
    lang:Lang;
    setLang:React.Dispatch<React.SetStateAction<Lang>>;
    searchValue_eng:string;
    searchValue_ger:string;
    results:DictEntry[];
    selectedFachgebietKey:string;
    setSelectedFachgebietKey:React.Dispatch<React.SetStateAction<string>>;
    setInstallHelp:React.Dispatch<React.SetStateAction<InstallHelp>>;
    installHelp:InstallHelp;
}){
    return(
        <>
            <div className="main-wrap">
                <div className="content-col">
                    <div className="topbar">
                        <FachgebieteDropdown
                            onSelect = {setSelectedFachgebietKey}
                            language = {lang}
                            selectedKey={selectedFachgebietKey}
                        />
                        <SelectLanguageDropdown
                            language = {lang}
                            onChange = {setLang}
                        />
                    </div>
                    <OutputBox
                        results = {results}
                    />
                    <div className="bottomBar">
                        <SearchInputs
                            lang={lang}
                            searchValue_eng = {searchValue_eng}
                            searchValue_ger = {searchValue_ger}
                            setSearchValue_eng = {setSearchValue_eng}
                            setSearchValue_ger = {setSearchValue_ger}
                        />
                        <InstallButton
                            lang = {lang}
                            setInstallHelp = {setInstallHelp}
                            installHelp={installHelp}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

//fügt die oben genannten Komponenten zu einem Desktoplayout zusammen
function DesktopLayout({

}:{

}){
    return(
        <>

        </>
    )
}

//zeigt die einzelnen Layouts auf dem Bildschirm an und steuert diese
export default function Responsive(){
    // const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches); //speichert die Breite des 
    const [isMobile, setIsMobile] = useState(true);
    const [searchValue_eng, setSearchValue_eng] = useState(""); //speichert englischen Suchbegriff
    const [searchValue_ger, setSearchValue_ger] = useState(""); //speichert deutschen Suchbegriff
    const [lang, setLang] = useState<Lang>("de"); //speichert die aktuelle Sprache
    const [selectedFachgebietKey, setSelectedFachgebietKey] = useState<string>("all"); //speichert das aktuelle Fachgebiet
    const [results, setResults] = useState<DictEntry[]>([]);
    const [installHelp, setInstallHelp] = useState<InstallHelp>("none");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const eng = searchValue_eng.trim();
        const ger = searchValue_ger.trim();

        if (!eng && !ger) {
            setResults([]);
            return;
        }

        const res = search(eng, ger, selectedFachgebietKey);
        setResults(res);
    }, [searchValue_eng, searchValue_ger, selectedFachgebietKey]);

    useEffect(() => {
    let cancelled = false;

    (async () => {
        try {
        await init();
        if (cancelled) return;
        setLoading(false);
        } catch (e: any) {
        if (cancelled) return;
        setLoadError(e?.message ?? "Daten konnten nicht geladen werden.");
        setLoading(false)
        }finally {
        if (!cancelled) setLoading(false);
        }
    })();

    return () => {
        cancelled = true;
    };
    }, []);

    if (loading) {
        return (
            <div className="loadingScreen">
            <div className="loadingCard">
                <div className="spinner" />
                <div className="loadingTitle">Loading</div>
                <div className="loadingText"></div>
            </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="loadingScreen">
            <div className="loadingCard">
                <div className="loadingTitle">Error</div>
                <div className="loadingText">{loadError}</div>
            </div>
            </div>
        );
    }

    return isMobile ? (
        <>
            <MobileLayout
                searchValue_eng={searchValue_eng}
                searchValue_ger={searchValue_ger}
                setSearchValue_eng={setSearchValue_eng}
                setSearchValue_ger={setSearchValue_ger}
                lang={lang}
                setLang={setLang}
                results={results}
                selectedFachgebietKey={selectedFachgebietKey}
                setSelectedFachgebietKey={setSelectedFachgebietKey}
                setInstallHelp={setInstallHelp}
                installHelp={installHelp}
            />

        </>
    ):(
        <DesktopLayout
        
        />
    )
}