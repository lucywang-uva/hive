import { Select } from './Select';
import { useState } from 'react';

const MOCK_MULTI_SELECT_OPTIONS = [{label: "apple", value: 1}, {label: "pear", value: 2}, {label: "banana", value: 3}, {label: "watermelon", value: 4}, {label: "orange", value: 5}, {label: "grape", value: 6}]
const MOCK_SINGLE_SELECT_OPTIONS = [{label: "carrot", value: 1}, {label: "cabbage", value: 2}, {label: "onion", value: 3}, {label: "mushroom", value: 4}, {label: "spinach", value: 5}, {label: "garlic", value: 6}]

const App = () => {
  const [selectedMulti, setSelectedMulti] = useState([]); 
  const [selectedSingle, setSelectedSingle] = useState(null); 


  return (
    <div className="flex justify-center pt-32 gap-32">
      <Select labelName={"Select fruits"} options={MOCK_MULTI_SELECT_OPTIONS} isMulti={true} selected={selectedMulti} setSelected={setSelectedMulti}/> {/*Multi select field*/}
      <Select labelName={"Select vegetable"} options={MOCK_SINGLE_SELECT_OPTIONS} isMulti={false} selected={selectedSingle} setSelected={setSelectedSingle} />  {/*Single select field*/}
    </div>

  );
}

export default App;
