import { useState } from 'react';

const useInputChange = () => {
  const [input, setInput] = useState({});
  const [changed, setChanged] = useState({});

  const handleInputChange = (event) => {
    setInput({
      ...input,
      [event.currentTarget.id]: event.currentTarget.value
    });
    setChanged({
      ...changed,
      [event.currentTarget.id]: true
    });
    console.log({changed});
    console.log({input});
  }
  
  return [input, handleInputChange, changed, setChanged]
}

export default useInputChange;
