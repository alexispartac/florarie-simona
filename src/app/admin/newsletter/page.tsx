'use client';
import React, { useState, useEffect } from 'react';
import { SidebarDemo } from '../components/SideBar';
import axios from 'axios';

const URL_NEWSLETTER = '/api/send-newsletter';
const URL_EMAILS = '/api/send-email/newsletter';

function NewsletterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const response = await axios.post(URL_NEWSLETTER, formData);

      if (response.status === 200) {
        alert('Newsletter trimis cu succes!');
        setFormData({ subject: '', content: '' });
        setIsModalOpen(false);
      } else {
        throw new Error('Eroare la trimiterea newsletter-ului');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('A apărut o eroare la trimiterea newsletter-ului.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white ">Newsletter</h1>
          <p className="text-gray-600 dark:text-white">Trimiteți un newsletter către toți abonații</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          + Newsletter nou
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Creare Newsletter</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                disabled={isSending}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Subiect
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isSending}
                  placeholder="Subiectul newsletter-ului"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Conținut
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isSending}
                  placeholder="Scrieți conținutul newsletter-ului aici..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  disabled={isSending}
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
                  disabled={isSending}
                >
                  {isSending ? 'Se trimite...' : 'Trimite Newsletter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Page = () => {
    const [emails, setEmails] = useState<string[]>([]);

    useEffect(() => {
        // Fetch newsletter subscribers from backend
        const fetchSubscribers = async () => {
            try {
                const response = await axios.get(URL_EMAILS);
                const data = await response.data;
                setEmails(data);
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            }
        };

        fetchSubscribers();
    }, []);

    return (
        <SidebarDemo>
            <div className="flex flex-1">
                <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="text-center py-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                        <h1 className="text-lg font-bold">Nr de persoane abonate la newsletter</h1>
                        <p>NUMAR DE CLIENTI: {emails.length} </p>
                        <NewsletterPage />
                    </div>
                </div>
            </div>
        </SidebarDemo>
    );
};


export default Page;