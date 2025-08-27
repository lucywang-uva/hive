import './App.css';
import { Select } from './Select';
import { useState } from 'react';


const App = () => {
  const mockMultiSelectOptions = [{label: "apple", value: 1, selected: false}, {label: "pear", value: 2, selected: false}, {label: "banana", value: 3, selected: false}, {label: "watermelon", value: 4, selected: false}, {label: "orange", value: 5, selected: false}, {label: "grape", value: 6, selected: false}]
  const mockSingleSelectOptions = [{label: "carrot", value: 1, selected: false}, {label: "cabbage", value: 2, selected: false}, {label: "onion", value: 3, selected: false}, {label: "mushroom", value: 4, selected: false}, {label: "spinach", value: 5, selected: false}, {label: "garlic", value: 6, selected: false}]
  
  const [_selectedMultiSelectOptions, setSelectedMultiSelectOptions] = useState([]);
  const [_selectedSingleSelectOption, setSelectedSingleSelectOption] = useState();

  return (
    <div className="flex items-center justify-center pt-32 gap-32">
      <Select labelName={"Select fruit(s)"} options={mockMultiSelectOptions} isMulti={true} setSelected={setSelectedMultiSelectOptions}/>
      <Select labelName={"Select vegetable"} options={mockSingleSelectOptions} isMulti={false} setSelected={setSelectedSingleSelectOption} />
    </div>

  );
}

export default App;
