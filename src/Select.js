import { useState, useEffect, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export const Select = ({labelName, options, isMulti = false, setSelected }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [optionsDropdown, setOptionsDropdown] = useState(
    isMulti
      ? [{ label: "Select all", value: null, selected: false }, ...options]
      : [{ label: "None", value: null, selected: false }, ...options]
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (selectedOption) => {
    let updatedOptions;
    if (isMulti) {
      if (selectedOption.value === null) {
        const newSelected = !selectedOption.selected;
        updatedOptions = optionsDropdown.map(option => ({ ...option, selected: newSelected }));
      } else {
        updatedOptions = optionsDropdown.map(option =>
            option.value === selectedOption.value
              ? { ...option, selected: !option.selected }
              : option
          )
        updatedOptions[0].selected = updatedOptions.slice(1).every(option => option.selected);
      }
      setSelected(updatedOptions.filter((option) => option.selected));
    } else {
        updatedOptions = optionsDropdown.map(option => ({
            ...option,
            selected: option.value === selectedOption.value
        }));
        setIsDropdownOpen(false);
        }
        setOptionsDropdown(updatedOptions);
        setSelected(updatedOptions.find((option) => option.selected));
    };

  const selectedOptions = optionsDropdown
    .filter(option => option.selected && option.value != null)
    .map(option => option.label)
    .join(", ");

  return (
    <div className="flex-col flex w-64 relative" ref={dropdownRef}>
      <div className="w-full select-none">
        <div
          className="z-0 px-3 py-4 border border-2 flex rounded-md text-left items-center justify-between border-blue-500 cursor-pointer relative"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {labelName && <label className="absolute mb-14 bg-white px-1 text-xs text-blue-500">
            {labelName}
          </label>}
          <span
            title={selectedOptions}
            className={`w-full whitespace-nowrap overflow-hidden overflow-ellipsis pr-2 ${
              selectedOptions.length === 0 ? "text-gray-500" : ""
            }`}
          >
            {selectedOptions.length > 0 ? selectedOptions : "Select..."}
          </span>
          <div className="flex gap-2">
            <span className="flex">
              {isDropdownOpen ? <FaCaretUp color={"gray"} /> : <FaCaretDown color={"gray"} />}
            </span>
          </div>
        </div>

        {isDropdownOpen && (
          <ul className="max-h-48 overflow-y-auto rounded-md flex flex-col border shadow-md mt-1 bg-white z-20 absolute w-full">
            {optionsDropdown.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                  option.selected ? "bg-blue-50" : ""
                }`}
                onClick={() => selectOption(option)}
              >
                {isMulti && option.value != null && (
                  <input type="checkbox" checked={option.selected} readOnly />
                )}
                <li className={`whitespace-nowrap overflow-hidden overflow-ellipsis ${option.value === null ? 'italic' : ''}`}>
                  {option.label}
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};