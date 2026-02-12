import "./dropdown.css"
import { VITE_FACHGEBIETE_JSON } from "../Functions"
import Dropdown from 'react-bootstrap/Dropdown';
type Lang = "de" | "en";

//stellt das Dropdownmenü für die Sprachauswahl dar (nur mobile Version)
export function SelectLanguageDropdown({
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
export function FachgebieteDropdown({
    onSelect,
    language = "de",
    selectedKey,
}:{
    onSelect:(key: string) => void;
    language?:Lang;
    selectedKey:string;
}){
    const selectedLabel = VITE_FACHGEBIETE_JSON.find((item) => item.key === selectedKey)?.[language];

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