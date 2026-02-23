import "./dropdown.css"
import { VITE_FACHGEBIETE_JSON } from "../Functions"
import Dropdown from "react-bootstrap/Dropdown";
import type { SelectLanguageDropdownProps, FachgebieteDropdownProps } from "../type";

//stellt das Dropdownmenü für die Sprachauswahl dar (nur mobile Version)
export function SelectLanguageDropdown({
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
export function FachgebieteDropdown({
    onSelect,
    language = "de",
    selectedKey,
}: FachgebieteDropdownProps){
  const selectedLabel =
    VITE_FACHGEBIETE_JSON.find((item) => item.key === selectedKey)?.[language] ??
    (language === "de" ? "Alle" : "All");

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