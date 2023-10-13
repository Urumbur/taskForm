import React from 'react';
import { CustomInput } from './components/CustomInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const API_KEY = '8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx';

type holidaysType = {
  country: string;
  iso: string;
  year: number;
  date: string;
  day: string;
  name: string;
  type: string;
};

type formType = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  photo: string;
  date: Date | null;
  time: string;
};

function App() {
  const [nationalHolidays, setNationalHolidays] = React.useState([]);
  const [form, setForm] = React.useState<formType>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    photo: '',
    date: new Date(),
    time: '12:00',
  });

  const [validity, setValidity] = React.useState({
    firstName: true,
    lastName: true,
    email: true,
    age: true,
    photo: true,
    date: true,
  });

  const filterDate = (date: Date) => {
    const days: string[] = nationalHolidays.map((el: holidaysType) =>
      format(new Date(el.date), 'dd-MM-yyyy'),
    );
    return days.filter((el) => el === format(date, 'dd-MM-yyyy')).length === 0 && isWeekday(date);
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setValidity((prevValidity) => ({
        ...prevValidity,
        [name]: isValidEmail(value),
      }));
    } else {
      setValidity((prevValidity) => ({
        ...prevValidity,
        [name]: !!value.trim(),
      }));
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPublicHolidays = async () => {
    await fetch(
      'https://api.api-ninjas.com/v1/holidays?country=PL&year=2023&type=national_holiday',
      {
        method: 'GET',
        headers: {
          'X-Api-Key': API_KEY,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setNationalHolidays(data));
  };

  React.useEffect(() => {
    getPublicHolidays();
  }, []);

  const isFormValid =
    Object.values(validity).every((isValid) => isValid) &&
    Object.values(form).every((el) => el !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        fetch('http://letsworkout.pl/submit', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Form is not valid');
    }
  };

  return (
    <div className='lg:container lg:mx-auto lg:w-80 py-5 px-5'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <div>
            <h6 className='text-2xl'>Personal info</h6>
            <CustomInput
              type='text'
              name='firstName'
              label='First Name'
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={validity.firstName}
            />

            <CustomInput
              type='text'
              name='lastName'
              label='Last Name'
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={validity.lastName}
            />

            <CustomInput
              type='email'
              name='email'
              label='Email Address'
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={validity.email}
            />

            <CustomInput
              type='range'
              name='age'
              label='Age'
              value={form.age}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={validity.age}
            />

            <CustomInput
              type='file'
              name='photo'
              label='Photo'
              value={form.photo}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={validity.photo}
            />
          </div>
          <div>
            <h6 className='text-2xl mt-2'>Your workout</h6>
            <DatePicker
              selected={form.date}
              calendarStartDay={1}
              onChange={(date) => setForm({ ...form, date })}
              filterDate={filterDate}
              inline
              dateFormat='dd/MM/yyyy'
            />
          </div>
          <button
            className={`border p-2 outline-none rounded-md mt-5 ${
              !isFormValid ? 'bg-purple-700/50' : 'bg-purple-700'
            } text-white`}
            type='submit'
            disabled={!isFormValid}
          >
            Send Application
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
