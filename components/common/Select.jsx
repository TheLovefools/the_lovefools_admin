import React, { forwardRef } from 'react';
import ReactSelect from 'react-select';

const Select = ({
  placeholder,
  options,
  isInvalid = false,
  errorMessage = '',
  label = '',
  isDisabled = false,
  handleInputChange,
  defaultValue = null,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label
          className={`text-small ${rest.isDisabled && 'opacity-disabled'}`}>
          {label}
        </label>
      )}
      <div className={`${label && 'mt-1.5'}`}>
        <ReactSelect
          placeholder={placeholder}
          onInputChange={handleInputChange}
          options={options}
          menuPlacement='auto'
          isDisabled={isDisabled}
          defaultValue={defaultValue}
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            control: () => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          // menuPosition='fixed'
          classNames={{
            control: (state) => {
              const defaultClassName =
                'rounded-small border-2 border-default-200 hover:border-default-400';
              const disabledClassName = state.isDisabled && 'opacity-disabled';
              const focusedClassName =
                state.isFocused && 'border-default-foreground';

              const errorClassName = isInvalid && '!border-danger';

              return `${defaultClassName} ${errorClassName} ${disabledClassName} ${focusedClassName}`;
            },
            indicatorSeparator: () => 'hidden',
            menuList: () => 'scrollBar rounded-small',
            option: (state) => {
              const defaultClassName = 'text-tiny hover:bg-gray-200';
              const focusedClassName = state.isFocused && '!bg-gray-200';
              const selectedClassName = state.isSelected && '!bg-gray-400';

              return `${defaultClassName} ${focusedClassName} ${selectedClassName}`;
            },
          }}
          {...rest}
        />
        {isInvalid && errorMessage && (
          <div
            className='p-1 text-tiny text-danger'
            role='alert'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default forwardRef(Select);
