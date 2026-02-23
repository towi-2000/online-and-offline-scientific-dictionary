import { getFachgebietLabel } from "../Functions";
import "./outputbox.css"
import type { FilteredOutputBoxProps } from "../type";
//stellt die Box für die Ausgabe der Ergebnisse dar (beide Versionen)
export function OutputBox({
    results,
    selectedFachgebietKey
}: FilteredOutputBoxProps){
    const visibleResults =
    selectedFachgebietKey === "all"
        ? results
        : results.filter((r) => r.module === selectedFachgebietKey);    

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