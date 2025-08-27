import { useState, useEffect, useRef, useMemo } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useVirtualizer } from "@tanstack/react-virtual";

export const Select = ({ labelName, options, selected, setSelected, isMulti = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allOptions = useMemo(() => [
  { label: isMulti ? "Select all" : "None", value: null, selected: isMulti? selected.length === options.length : !selected }, 
    ...options.map(option => ({
      ...option,
      selected: isMulti
        ? selected.some(select => select.value === option.value)
        : selected?.value === option.value
    }))
  ], [options, selected, isMulti]);

  const virtualizedOptions = useVirtualizer({
    count: allOptions.length,
    estimateSize: () => 40, 
    overscan: 3,
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
        const isSelectAllSelected = selected.length === options.length;
        setSelected(isSelectAllSelected ? [] : [...options]);
      } else {
        const isOptionCurrentlySelected = selected.some(select => select.value === option.value);
        const updatedSelected = isOptionCurrentlySelected
          ? selected.filter(select => select.value !== option.value)
          : [...selected, option];
        setSelected(updatedSelected);
      }
    } else {
      setSelected(option.value === null ? null : option);
      setIsDropdownOpen(false);
    }
  };

  const fieldText = useMemo(() => {
    if (isMulti) {
      return selected.map(select => select.label).join(", ");
    }
    return selected?.label; 
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
            className="max-h-64 overflow-y-auto rounded-md flex-col border shadow-md w-full"
            style={{position: 'relative' ,height: `${virtualizedOptions.getTotalSize()}px` }}
          >
            {virtualizedOptions.getVirtualItems().map(item => {
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
