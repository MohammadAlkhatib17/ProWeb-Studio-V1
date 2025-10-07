'use client';

import { useState } from 'react';

// Form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  projectTypes: string[];
  message: string;
}

// Minimal contact form schema
const validateForm = (data: FormData) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.length < 2) {
    errors.name = 'Naam is verplicht (minimaal 2 karakters)';
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Geldig e-mailadres is verplicht';
  }
  
  if (!data.message || data.message.length < 10) {
    errors.message = 'Bericht is verplicht (minimaal 10 karakters)';
  }
  
  if (!data.projectTypes || data.projectTypes.length === 0) {
    errors.projectTypes = 'Selecteer minimaal één projecttype';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

export default function MinimalContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectTypes: [] as string[],
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleProjectTypeChange = (type: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      projectTypes: checked 
        ? [...prev.projectTypes, type]
        : prev.projectTypes.filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrors({});

    const validation = validateForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setStatus('idle');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', projectTypes: [], message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Bericht Verzonden!</h2>
          <p className="text-neutral-300">
            Bedankt voor uw bericht. We nemen binnen 1 werkdag contact met u op.
          </p>
        </div>
      </div>
    );
  }

  const projectTypeOptions = [
    'Website laten maken',
    'Webshop bouwen',
    '3D website ervaring',
    'SEO optimalisatie',
    'Onderhoud & support',
    'Anders'
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Naam *
          </label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Uw naam"
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="uw@email.nl"
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Telefoon (optioneel)
          </label>
          <input
            type="tel"
            id="phone"
            value={form.phone}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+31 6 12345678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">
            Projecttype *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectTypeOptions.map((type) => (
              <label key={type} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={form.projectTypes.includes(type)}
                  onChange={(e) => handleProjectTypeChange(type, e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
          {errors.projectTypes && <p className="mt-1 text-sm text-red-400">{errors.projectTypes}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Bericht *
          </label>
          <textarea
            id="message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Vertel ons over uw project..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
        >
          {status === 'sending' ? 'Verzenden...' : 'Verstuur Bericht'}
        </button>

        {status === 'error' && (
          <div className="text-center text-red-400">
            Er is een fout opgetreden. Probeer het opnieuw of neem direct contact op via contact@prowebstudio.nl
          </div>
        )}
      </form>
    </div>
  );
}