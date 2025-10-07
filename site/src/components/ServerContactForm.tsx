import { redirect } from 'next/navigation';

async function submitContact(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;
  const projectTypes = formData.getAll('projectTypes') as string[];
  
  // Basic validation
  if (!name || name.length < 2) {
    throw new Error('Naam is verplicht (minimaal 2 karakters)');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Geldig e-mailadres is verplicht');
  }
  
  if (!message || message.length < 10) {
    throw new Error('Bericht is verplicht (minimaal 10 karakters)');
  }
  
  if (!projectTypes || projectTypes.length === 0) {
    throw new Error('Selecteer minimaal één projecttype');
  }
  
  try {
    // Here you would normally send the data to your API or email service
    // For now, we'll just simulate a successful submission
    console.log('Contact form submission:', {
      name, email, phone, message, projectTypes
    });
    
    // Redirect to success page or back to contact with success param
    redirect('/contact?success=true');
  } catch (error) {
    console.error('Contact form error:', error);
    redirect('/contact?error=true');
  }
}

interface ServerContactFormProps {
  searchParams: { success?: string; error?: string };
}

export default function ServerContactForm({ searchParams }: ServerContactFormProps) {
  const { success, error } = searchParams;

  if (success) {
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
      <form action={submitContact} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">
              Er is een fout opgetreden. Probeer het opnieuw of neem direct contact op via contact@prowebstudio.nl
            </p>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Naam *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Uw naam"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="uw@email.nl"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Telefoon (optioneel)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
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
                  name="projectTypes"
                  value={type}
                  className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Bericht *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            minLength={10}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Vertel ons over uw project..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
        >
          Verstuur Bericht
        </button>
      </form>
    </div>
  );
}