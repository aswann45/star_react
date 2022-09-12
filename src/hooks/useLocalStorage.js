import { useState, useEffect } from 'react';

function getStorageItem(key, defaultValue) {
  // retrieve an item from local storage by key
  //
  const storedItem = localStorage.getItem(key);
  const parsedItem = JSON.parse(storedItem);
  return parsedItem ?? defaultValue;
}

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageItem(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value])

  return [value, setValue];
};

export default useLocalStorage;
