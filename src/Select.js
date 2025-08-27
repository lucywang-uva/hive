import { useState, useEffect, useRef, useMemo } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useVirtualizer } from "@tanstack/react-virtual";

export const Select = ({ labelName, options, selected, setSelected, isMulti = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allOptions = useMemo(() => [
    isMulti
      ? { label: "Select all", value: null, selected: selected.length === options.length }
      : { label: "None", value: null, selected: !selected },
    ...options.map(option => ({
      ...option,
      selected: isMulti
        ? selected.some(s => s.value === option.value)
        : selected?.value === option.value
    }))
  ], [options, selected, isMulti]);

  const virtualizedItem = useVirtualizer({
    count: allOptions.length,
    estimateSize: () => 40, 
    getScrollElement: () => dropdownRef.current,
  });

  useEffect(() => {
    const onClickOutsideDropdown = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", onClickOutsideDropdown);
  }, []);

  const selectOption = (option) => {
    if (isMulti) {
      if (option.value === null) {
        const areAllSelected = selected.length === options.length;
        setSelected(areAllSelected ? [] : [...options]);
      } else {
        const alreadySelected = selected.some(s => s.value === option.value);
        const newSelected = alreadySelected
          ? selected.filter(s => s.value !== option.value)
          : [...selected, option];
        setSelected(newSelected);
      }
    } else {
      if (option.value === null) setSelected(null);
      else setSelected(option);
      setIsDropdownOpen(false);
    }
  };

  const fieldText = useMemo(() => {
    if (isMulti) {
      return selected.map(o => o.label).join(", ");
    }
    return selected?.label || ""; 
  }, [isMulti, selected])


  return (
    <div className="flex-col w-64 relative select-none" ref={inputRef}>
        <div
          className="px-3 py-4 border border-2 flex rounded-md items-center justify-between border-blue-500 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {labelName && (
            <label className="absolute mb-14 bg-white px-1 text-xs text-blue-500">{labelName}</label>
          )}
          <span
            title={fieldText}
            className={`whitespace-nowrap overflow-hidden overflow-ellipsis pr-2 ${!fieldText && "text-gray-500"}`}
          >
            {fieldText ? fieldText : "Select..."}
          </span>
            {isDropdownOpen ? <FaCaretUp color="gray" /> : <FaCaretDown color="gray" />}
        </div>
        {isDropdownOpen && (
          <ul
            ref={dropdownRef}
            className="absolute max-h-64 overflow-y-auto rounded-md flex-col border shadow-md w-full"
            style={{height: `${virtualizedItem.getTotalSize()}px` }}
          >
            {virtualizedItem.getVirtualItems().map(item => {
              const option = allOptions[item.index];
              return (
                <div
                  key={option.value}
                  className={`absolute w-full px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                    option.selected ? "bg-blue-200" : ""
                  }`}
                  style={{
                    transform: `translateY(${item.start}px)`,
                  }}
                  onClick={() => selectOption(option)}
                >
                  {isMulti && option.value != null && (
                    <input type="checkbox" checked={option.selected} readOnly/>
                  )}
                  <li className={`whitespace-nowrap overflow-hidden overflow-ellipsis ${option.value === null ? "italic" : ""}`}>
                    {option.label}
                  </li>
                </div>
              );
            })}
          </ul>
        )}
    </div>
  );
};
