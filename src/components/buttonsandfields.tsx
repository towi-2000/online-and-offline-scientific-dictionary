import "./buttonsandfields.css"
import { VITE_FACHGEBIETE_JSON, changeLanguage } from '../Functions';
import { installFunction } from '../installFunction';
import gerFlag from "../images/germany_flag.png"
import engFlag from "../images/us_flag.png"

type Fachgebiet = (typeof VITE_FACHGEBIETE_JSON)[number];
type Lang = "de" | "en";
type InstallHelp = "none" | "browser" | "ios";

//stellt die Buttons für die Auswahl des Fachgebietes dar (nur Browserversion)
export function SelectionButtons({
        setSelectedFachgebietKey,
        selectedFachgebietKey,
        lang
    }:{
        selectedFachgebietKey: string;
        setSelectedFachgebietKey: React.Dispatch<React.SetStateAction<string>>;
        lang:Lang;
    }){
    const handleButtonAction = (input:string) => {
        //const key = VITE_FACHGEBIETE_JSON.find(f => f.de === input)?.key ?? null;
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
export function InstallButton({
    lang,
    isInstalled,
    setInstallHelp,
    setIsInstalled,
}:{
    lang:Lang;
    isInstalled:boolean;
    setIsInstalled:React.Dispatch<React.SetStateAction<boolean>>;
    setInstallHelp:React.Dispatch<React.SetStateAction<InstallHelp>>;
}){

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
    return(
        <>
            <div className="installWrap">
                {!isInstalled && (
                    <button className='installBtn buttonstyle' onClick={installHandler}>
                    {changeLanguage(lang,"install")}
                </button>)}
            </div>

        </>
    )
}

//stellt die Eingabefelder für die Suche dar (beide Versionen)
export function SearchInputs({
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
    setSearchValue_eng,
    setSearchValue_ger,
    searchValue_eng,
    searchValue_ger
}:{
    lang:Lang;
    searchValue_eng:string;
    searchValue_ger:string;
    setLang: React.Dispatch<React.SetStateAction<Lang>>;
    setSearchValue_eng:React.Dispatch<React.SetStateAction<string>>;
    setSearchValue_ger:React.Dispatch<React.SetStateAction<string>>;
}){
    const handleLanguageSelection = (fachKey: Lang) => {
        setLang(fachKey);
    }

    return(
        <div className='flag-box'>
            <button className={"flag-box" + (lang === "de" ? " active" : "")} onClick={() => handleLanguageSelection("de")}>
                <img src = {gerFlag} alt="ger" className = 'flag-img'/>
            </button>
            <button className={"flag-box" + (lang === "en" ? " active" : "")} onClick={() => handleLanguageSelection("en")}>
                <img src = {engFlag} alt="eng" className = 'flag-img'/>
            </button>
        </div>
    )
}