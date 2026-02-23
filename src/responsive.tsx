//Datei, um die responsive Oberfläche zu organisiseren. Die einzelnen Anzeigeelemente sind in Komponenten aufgeteilt, um
//eine bessere Modularisierung zu erreichen. Die einzelnen Funktionen sind unten erklärt.
import "./responsive.css"
import type {
  Lang,
  InstallHelp,
  Fachgebiet,
  DictEntry,
  SelectionButtonsProps,
  InstallButtonProps,
  SearchInputsProps,
  LanguageFlagsProps,
  SelectLanguageDropdownProps,
  FachgebieteDropdownProps,
  OutputBoxProps,
  MobileLayoutProps,
  DesktopLayoutProps,
} from "./type"
import { VITE_FACHGEBIETE_JSON, search, changeLanguage, getFachgebietLabel, init } from './Functions'
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { installFunction, ZeigeAnleitung, ZeigeAnleitung_IOS } from './installFunction';
import gerFlag from "./images/germany_flag.png"
import engFlag from "./images/us_flag.png"

//stellt die Buttons für die Auswahl des Fachgebietes dar (nur Browserversion)
function SelectionButtons({
        setSelectedFachgebietKey,
        selectedFachgebietKey,
        lang
  }: SelectionButtonsProps){
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
}: InstallButtonProps) {
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
}: SearchInputsProps){
  const handleEngChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue_eng(e.target.value);
    };

    const handleGerChange = (e: ChangeEvent<HTMLInputElement>) => {
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
}: LanguageFlagsProps){
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
}: SelectLanguageDropdownProps){
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
}: FachgebieteDropdownProps){
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
function OutputBox({ results }: OutputBoxProps) {
  return (
    <div className="outputbox">
      <div className="outputbox-inner">
        {results.map((item) => (
          <div className="outputrow" key={item.sourceIndex ?? `${item.ger}-${item.eng}`}>
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
}: MobileLayoutProps){
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
}: DesktopLayoutProps){
    return(
    <div className="main-wrap desktop">
      <div className="desktopHeader">
        <LanguageFlags lang={lang} setLang={setLang} />
        <SearchInputs
          lang={lang}
          searchValue_eng={searchValue_eng}
          searchValue_ger={searchValue_ger}
          setSearchValue_eng={setSearchValue_eng}
          setSearchValue_ger={setSearchValue_ger}
        />
        <InstallButton
          lang={lang}
          setInstallHelp={setInstallHelp}
          installHelp={installHelp}
        />
      </div>
      <div className="desktopBody">
        <OutputBox results={results} />
        <SelectionButtons
          selectedFachgebietKey={selectedFachgebietKey}
          setSelectedFachgebietKey={setSelectedFachgebietKey}
          lang={lang}
        />
      </div>
    </div>
    )
}

//zeigt die einzelnen Layouts auf dem Bildschirm an und steuert diese
export default function Responsive(){
    // const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches); //speichert die Breite des 
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);
    const [searchValue_eng, setSearchValue_eng] = useState(""); //speichert englischen Suchbegriff
    const [searchValue_ger, setSearchValue_ger] = useState(""); //speichert deutschen Suchbegriff
    const [lang, setLang] = useState<Lang>("de"); //speichert die aktuelle Sprache
    const [selectedFachgebietKey, setSelectedFachgebietKey] = useState<string>("all"); //speichert das aktuelle Fachgebiet
    const [installHelp, setInstallHelp] = useState<InstallHelp>("none");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
      setIsMobile(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const results = useMemo(() => {
      const eng = searchValue_eng.trim();
      const ger = searchValue_ger.trim();

      if (!eng && !ger) return [];

      return search(eng, ger, selectedFachgebietKey);
    }, [searchValue_eng, searchValue_ger, selectedFachgebietKey]);

    useEffect(() => {
      let cancelled = false;

      (async () => {
        try {
          await init();
        } catch (e: unknown) {
          if (cancelled) return;
          const message = e instanceof Error ? e.message : "Daten konnten nicht geladen werden.";
          setLoadError(message);
        } finally {
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
    )
}