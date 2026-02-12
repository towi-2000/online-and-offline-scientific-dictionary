import { VITE_FACHGEBIETE_JSON,WOERTERBUCH_ERWEITERT } from '../Functions'
import "./outputbox.css"
type Fachgebiet = (typeof VITE_FACHGEBIETE_JSON)[number];
type Lang = "de" | "en";
//stellt die Box für die Ausgabe der Ergebnisse dar (beide Versionen)
export function OutputBox({
    results,
    selectedFachgebietKey
}:{
    results:typeof WOERTERBUCH_ERWEITERT;
    selectedFachgebietKey:string;
}){
    const visibleResults =
    selectedFachgebietKey === "all"
        ? results
        : results.filter((r) => r.module === selectedFachgebietKey);    

    const getFachgebietLabel = (moduleValue: string, targetLang: Lang) => {
        const v = moduleValue.trim().toLowerCase();

        const fach =
        VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.key.trim().toLowerCase() === v) ||
        VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.de.trim().toLowerCase() === v) ||
        VITE_FACHGEBIETE_JSON.find((f:Fachgebiet) => f.en.trim().toLowerCase() === v);

        return fach ? fach[targetLang] : moduleValue;
    };

    return(
        <div className="outputbox">
            {visibleResults.map((item,idx) => (
                <div className='outputrow' key={idx}>
                    {/* deutsche Spalte */}
                    <div className="outputcell">
                        <span>{item.ger}{" "}</span>
                        <span className='outputmodule'>[{getFachgebietLabel(item.module,"de")}]</span>
                    </div> 
                    {/* englische Spalte */}
                    <div className="outputcell">
                        <span>{item.eng}{" "}</span>
                        <span className='outputmodule'>[{getFachgebietLabel(item.module,"en")}]</span>
                    </div> 
                </div>
            ))}
        </div>
    )
}