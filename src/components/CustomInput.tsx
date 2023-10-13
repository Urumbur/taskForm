import React from 'react';

type InputProps = {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isValid: boolean;
};

export const CustomInput: React.FC<InputProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  onBlur,
  isValid,
}) => {
  return (
    <div className='flex flex-col my-2'>
      <label>{label}</label>
      {type === 'range' ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={8}
          max={100}
          className={`border p-2 outline-none rounded-md accent-purple-700`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`border p-2 outline-none rounded-md ${
            isValid ? 'border-gray-300' : 'border-red-500 bg-red-100'
          }`}
        />
      )}
      {!isValid && type === 'email' && <p className='text-red-500'>Podaj poprawny adres email</p>}
      {!isValid && type !== 'email' && type !== 'range' && (
        <p className='text-red-500'>To pole jest wymagane</p>
      )}
    </div>
  );
};
