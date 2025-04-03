import { useCallback, useEffect, useState } from 'react';
import TextField from './TextField';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SearchBar = ({ onChange, value, className, ...restProps }) => {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [prevDebouncedSearchTerm, setPrevDebouncedSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchQuery.trim(), 500);

  useEffect(() => {
    if (prevDebouncedSearchTerm !== debouncedSearchTerm) {
      onChange(debouncedSearchTerm);
      setPrevDebouncedSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onChange, prevDebouncedSearchTerm]);

  const handleInputChange = useCallback((event) => {
    setSearchQuery(event);
  }, []);

  const handleClearClick = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    setSearchQuery(value || '');
  }, [value]);

  return (
    <TextField
      value={searchQuery || ''}
      radius='sm'
      className={`max-w-[220px] ${className}`}
      onChange={handleInputChange}
      endContent={
        searchQuery ? (
          <XMarkIcon
            className='w-5 cursor-pointer'
            onClick={() => handleClearClick()}
          />
        ) : (
          <MagnifyingGlassIcon className='w-5 cursor-pointer' />
        )
      }
      {...restProps}
    />
  );
};

export default SearchBar;
