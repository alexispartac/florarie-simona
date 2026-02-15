'use client';

import { useState, useEffect } from 'react';
import { Store, Power, PowerOff, AlertCircle, Clock, RefreshCw, Save } from 'lucide-react';
import type { StoreSettings } from '@/types/store-settings';

export default function StoreSettingsTab() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [isOpen, setIsOpen] = useState(true);
  const [closureReason, setClosureReason] = useState('');
  const [closureMessage, setClosureMessage] = useState('');
  const [scheduledOpenTime, setScheduledOpenTime] = useState('');

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/store-settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch store settings');
      }
      
      const data = await response.json();
      setSettings(data);
      setIsOpen(data.isOpen);
      setClosureReason(data.closureReason || '');
      setClosureMessage(data.closureMessage || '');
      setScheduledOpenTime(data.scheduledOpenTime ? new Date(data.scheduledOpenTime).toISOString().slice(0, 16) : '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isOpen,
          closureReason: closureReason.trim() || undefined,
          closureMessage: closureMessage.trim() || undefined,
          scheduledOpenTime: scheduledOpenTime || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update store settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setSuccessMessage('Setările magazinului au fost actualizate cu succes!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Se încarcă setările magazinului...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <Store className="h-6 w-6" />
          Gestionare Status Magazin
        </h2>
        <p className="text-[var(--muted-foreground)] mt-1">
          Controlează dacă clienții pot plasa comenzi în magazin
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)] rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--destructive)]">Eroare</h3>
            <p className="text-sm text-[var(--destructive)]">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-600">Succes</h3>
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Current Status Display */}
      <div className="mb-8 p-6 bg-[var(--accent)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Status Curent</h3>
            <div className="flex items-center gap-2">
              {settings?.isOpen ? (
                <>
                  <Power className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-semibold">Magazinul este DESCHIS</span>
                </>
              ) : (
                <>
                  <PowerOff className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-semibold">Magazinul este ÎNCHIS</span>
                </>
              )}
            </div>
          </div>
          {settings?.updatedAt && (
            <div className="text-right text-sm text-[var(--muted-foreground)]">
              <p>Ultima actualizare:</p>
              <p className="font-medium">{new Date(settings.updatedAt).toLocaleString('ro-RO')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Store Status Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
          Status Magazin
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              isOpen
                ? 'border-green-600 bg-green-50 dark:bg-green-950'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-green-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Power className={`h-6 w-6 ${isOpen ? 'text-green-600' : 'text-[var(--muted-foreground)]'}`} />
              <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-[var(--muted-foreground)]'}`}>
                Deschide Magazin
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Clienții pot plasa comenzi
            </p>
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              !isOpen
                ? 'border-red-600 bg-red-50 dark:bg-red-950'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-red-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PowerOff className={`h-6 w-6 ${!isOpen ? 'text-red-600' : 'text-[var(--muted-foreground)]'}`} />
              <span className={`font-semibold ${!isOpen ? 'text-red-600' : 'text-[var(--muted-foreground)]'}`}>
                Închide Magazin
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Dezactivează temporar comenzile
            </p>
          </button>
        </div>
      </div>

      {/* Closure Details (shown when store is closed) */}
      {!isOpen && (
        <div className="space-y-6 p-6 bg-[var(--accent)]/50 rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Detalii Închidere
          </h3>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Motiv Închidere (Notă Internă)
            </label>
            <input
              type="text"
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
              placeholder="ex: Sărbătoare, Inventar, Mentenanță"
              className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Mesaj pentru Clienți (Opțional)
            </label>
            <textarea
              value={closureMessage}
              onChange={(e) => setClosureMessage(e.target.value)}
              placeholder="ex: Suntem închisi pentru sărbători. Revenim în curând!"
              rows={3}
              className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] resize-none"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Acest mesaj va fi afișat clienților când încearcă să plaseze o comandă
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-2">
              <Clock className="h-4 w-4" />
              Ora Programată Redeschidere (Opțional)
            </label>
            <input
              type="datetime-local"
              value={scheduledOpenTime}
              onChange={(e) => setScheduledOpenTime(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Setează ora la care magazinul se va redeschide automat (necesită cron job pe server)
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={fetchStoreSettings}
          disabled={saving}
          className="px-6 py-2 bg-[var(--accent)] text-[var(--foreground)] rounded-md hover:bg-[var(--accent)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Resetare
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--hover-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvează Modificări
            </>
          )}
        </button>
      </div>

      {/* Information Box */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <h4 className="font-semibold mb-1">Cum Funcționează Statusul Magazinului</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Când este închis, clienții pot răsfoi produsele dar nu pot finaliza comanda</li>
              <li>Mesajul de închidere va fi afișat la pagina de checkout dacă este furnizat</li>
              <li>Comenzile existente nu sunt afectate de schimbările statusului magazinului</li>
              <li>Poți redeschide magazinul oricând schimbând statusul înapoi la Deschis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
