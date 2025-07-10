'use client';
import React from 'react';
import { SidebarDemo } from '../components/SideBar';
import { DateTimePicker } from '@mantine/dates';
import axios from 'axios';

const URL_CLOSE_PERIOD = '/api/close-period'; // Endpoint pentru setarea perioadei de închidere

function CalendarForClose() {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleAndSetDate = async (date: string | null) => {
    setLoading(true);
    if (!date) {
      setLoading(false);
      alert('No date selected');
      return;
    } else {
      console.log(date);
      await axios.patch(URL_CLOSE_PERIOD, { date })
        .then((response) => {
          console.log('Response:', response.data);
          setLoading(false);
          alert(`Perioada de închidere a fost setată cu succes! Este ${date}`);
        })
        .catch((error) => {
          console.log('Error setting close period:', error);
          setLoading(false);
          alert('A apărut o eroare la setarea perioadei de închidere.');
        });
    }
  }


  return (
    <div className="w-full max-w-full">
      <DateTimePicker
        radius="xs"
        size="sm"
        label="Introduceti o data viitoare"
        withAsterisk
        description="Selectați o dată și o oră"
        placeholder="Selectați o dată"
        className="max-w-full"
        dropdownType="modal"
        defaultValue={new Date()}
        clearable
        value={selectedDate} // Leagă valoarea selectată de starea `selectedDate`
        onChange={(value) => setSelectedDate(value)} // Actualizează `selectedDate` când utilizatorul selectează o dată
        styles={{
          calendarHeaderControl: {
            fontSize: '12px', // Dimensiunea textului (pentru săgeți)
            width: '24px', // Dimensiunea butonului
            height: '24px', // Dimensiunea butonului
            padding: '4px', // Spațiere internă
            borderRadius: '50%', // Colțuri rotunjite pentru săgeți
          },
          day: {
            margin: '4px', // Spațiu între zile
          },
        }}
      />
      {/* Afișează data selectată */}
      <div className="mt-4">
        <p>Data selectată: {selectedDate ? selectedDate.toString() : 'Nicio dată selectată'}</p>
        <button
          onClick={() => handleAndSetDate(selectedDate)}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          { loading ? 'Se încarcă...' : 'Setează perioada de închidere' }
        </button>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <SidebarDemo>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex gap-2">
            <div
              className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
              <h1>Setare perioada de inchidere </h1>
            </div>
          </div>
          <CalendarForClose />
        </div>
      </div>
    </SidebarDemo>
  );
};

export default Page;