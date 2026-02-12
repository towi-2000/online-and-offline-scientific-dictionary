import './Browser.css'
import { getWOERTERBUCH_ERWEITERT,getVITE_FACHGEBIETE_JSON, search, changeLanguage } from './Functions'
import { useState, useEffect } from "react"
import gerFlag from "./images/germany_flag.png"
import engFlag from "./images/us_flag.png"
import { installFunction,ZeigeAnleitung,ZeigeAnleitung_IOS } from './installFunction';
import Countdown from 'react-countdown';

export default function App() {
  const VITE_FACHGEBIETE_JSON = getVITE_FACHGEBIETE_JSON();
  const WOERTERBUCH_ERWEITERT = getWOERTERBUCH_ERWEITERT();
  const [results, setResults] = useState<typeof WOERTERBUCH_ERWEITERT>([]);
  const [searchValue_eng, setSearchValue_eng] = useState("");
  const [searchValue_ger, setSearchValue_ger] = useState("");
  const [selectedFachgebietKey, setSelectedFachgebietKey] = useState<string>("all");
  const [lang, setLang] = useState<Lang>("de");
  const [isInstalled, setIsInstalled] = useState(false);
  const [installHelp, setInstallHelp] = useState<InstallHelp>("none");
  const [timerDone,setTimerDone] = useState(false);
  const [targetTime,setTargetTime] = useState<number>();
  type Lang = "de" | "en";
  type InstallHelp = "none" | "browser" | "ios";
  type Fachgebiet = (typeof VITE_FACHGEBIETE_JSON)[number];
  type ResultType = {ger:string,de:string,eng:string,en:string,module:string}

  const visibleResults =
  selectedFachgebietKey === "all"
    ? results
    : results.filter((r) => r.module === selectedFachgebietKey);

  const handleEngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue_eng(e.target.value);
    handleSearchClick();
  };

  const handleGerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue_ger(e.target.value);
    handleSearchClick();
  };

  const handleSearchClick = () => {
    setResults(
      search(searchValue_eng, searchValue_ger, selectedFachgebietKey)
    );
  };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") handleSearchClick();
  // }

  const handleLanguageSelection = (fachKey: Lang) => {
    setLang(fachKey);
  }

  const handleButtonAction = (input:string) => {
    //const key = VITE_FACHGEBIETE_JSON.find(f => f.de === input)?.key ?? null;
    setSelectedFachgebietKey(input);
  };

  async function installHandler() {
    const info = await installFunction();

    if(info.type === "SHOW_BROWSER_INSTRUCTIONS"){
      setInstallHelp("browser");
    }

    if(info.type === "SHOW_IOS_INSTRUCTIONS"){
      setInstallHelp("ios");
    }

    if(info.type === "ALREADY_INSTALLED"){
      setIsInstalled(true);
    }

    if(info.type === "PROMPT_AVAILABLE"){setInstallHelp("none");}
  }

  const getFachgebietLabel = (moduleValue: string, targetLang: Lang) => {
    const v = moduleValue.trim().toLowerCase();

    const fach =
    VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.key.trim().toLowerCase() === v) ||
    VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.de.trim().toLowerCase() === v) ||
    VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.en.trim().toLowerCase() === v);

    return fach ? fach[targetLang] : moduleValue;
  };

    return (
    <>
    <title>{changeLanguage(lang,"title")}</title>
      {targetTime && !timerDone &&(
        <Countdown
          date={targetTime}
          onComplete={() => setTimerDone(true)}
          renderer={() => null}
        />
      )}
      {/* Anleitung */}
      {installHelp !== "none" && (
        <div className='installOverlay'>
          <div className='installOverlayCard'>
            {installHelp === "browser" && <ZeigeAnleitung lang={lang}/>}
            {installHelp === "ios" && <ZeigeAnleitung_IOS lang={lang}/>}
            <button className='installbutton' onClick={() => setInstallHelp("none")}>
              {changeLanguage(lang,"close")}
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className='headerStyle'>
        <div className='headerWrap'>

          {/* Links */}
          <div className='header_left'>
            <button className={"flag-box" + (lang === "de" ? " active" : "")} onClick={() => handleLanguageSelection("de")}>
              <img src = {gerFlag} alt="ger" className = 'flag-img'/>
            </button>
            <button className={"flag-box" + (lang === "en" ? " active" : "")} onClick={() => handleLanguageSelection("en")}>
              <img src = {engFlag} alt="eng" className = 'flag-img'/>
            </button>
          </div>

          {/* Mitte */}
          <div className="header_mid">
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
            {/* <button className='buttonstyle' onClick={handleSearchClick}>
              {changeLanguage(lang,"search")}
            </button> */}
          </div>

          {/* Rechts */}
          {!isInstalled && (
            <button className='buttonstyle header_right installBtn' onClick={installHandler}>
            {changeLanguage(lang,"install")}
          </button>)}
        </div>
      </header>
      
      {/* Mittelteil */}
      <div className='main-wrap'
      >
        {/* Ausgabebox */}
        <div className="container">
          
          {/* Deutsch-Spalte */}
          <div>
            {visibleResults.map((item, idx) => (
              <div
                key={`ger-${idx}`}
                style={{
                  marginBottom: "0.75rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "0.5rem",
                }}
              >
                <p style={{ margin: 0 }}>
                  {item.ger}{" "}
                  <span style={{ color: "#666" }}>[{getFachgebietLabel(item.module,"de")}]</span>
                </p>
              </div>
            ))}
          </div>

          {/* Trennlinie */}
          <div className="divider" />

          {/* Englisch-Spalte */}
          <div>
            {visibleResults.map((item, idx) => (
              <div
                key={`eng-${idx}`}
                style={{
                  marginBottom: "0.75rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "0.5rem",
                }}
              >
                <p style={{ margin: 0 }}>
                  {item.eng}{" "}
                  <span style={{ color: "#666" }}>[{getFachgebietLabel(item.module,"en")}]</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons rechts */}
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
      </div>
    </>
  );
}