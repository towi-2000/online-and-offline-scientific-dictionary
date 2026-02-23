import "./buttonsandfields.css"
import { VITE_FACHGEBIETE_JSON, changeLanguage } from "../Functions";
import { installFunction } from "../installFunction";
import type {
    Fachgebiet,
    SelectionButtonsProps,
    InstallButtonProps,
    SearchInputsProps,
    LanguageFlagsProps,
} from "../type";
import gerFlag from "../images/germany_flag.png"
import engFlag from "../images/us_flag.png"

//stellt die Buttons für die Auswahl des Fachgebietes dar (nur Browserversion)
export function SelectionButtons({
        setSelectedFachgebietKey,
        selectedFachgebietKey,
        lang
    }: SelectionButtonsProps){
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
    setInstallHelp,
    installHelp: _installHelp,
}: InstallButtonProps){

    function installHandler() {
        const result = installFunction(lang);
        setInstallHelp(result);
    }
    return(
        <>
            <div className="installWrap">
                <button className='installBtn buttonstyle' onClick={installHandler}>
                  {changeLanguage(lang,"install")}
                </button>
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
}: SearchInputsProps){
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
}: LanguageFlagsProps){
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