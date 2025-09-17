import { WebPageSchema } from '@/components/schema/WebPageSchema';
import { HowToSchema } from '@/components/schema/HowToSchema';

const werkwijzeSteps = [
	{
		name: 'Kennismaking & Briefing',
		text: 'We beginnen met een vrijblijvend gesprek waarin we uw wensen, doelen en budget bespreken. U ontvangt binnen 24 uur een offerte op maat.',
		url: 'https://prowebstudio.nl/contact',
	},
	{
		name: 'Strategie & Concept',
		text: 'Na akkoord ontwikkelen we een strategie en conceptontwerp. We maken wireframes en een visueel design dat perfect aansluit bij uw merk.',
		image: 'https://prowebstudio.nl/images/design-process.jpg',
	},
	{
		name: 'Design & Development',
		text: 'Ons team bouwt uw website in WordPress met responsive design, SEO-optimalisatie en alle gewenste functionaliteiten.',
		image: 'https://prowebstudio.nl/images/development.jpg',
	},
	{
		name: 'Testing & Feedback',
		text: 'We testen de website uitgebreid op verschillende apparaten en browsers. U krijgt toegang tot een testomgeving voor feedback.',
		image: 'https://prowebstudio.nl/images/testing.jpg',
	},
	{
		name: 'Lancering',
		text: 'Na uw goedkeuring lanceren we de website. We zorgen voor een soepele overgang en monitoren de eerste dagen intensief.',
		image: 'https://prowebstudio.nl/images/launch.jpg',
	},
	{
		name: 'Training & Overdracht',
		text: 'U ontvangt een persoonlijke training voor het CMS en alle documentatie. We blijven beschikbaar voor support en onderhoud.',
		url: 'https://prowebstudio.nl/support',
	},
];

export default function Werkwijze() {
	return (
		<>
			<WebPageSchema
				name="Onze Werkwijze - ProWeb Studio"
				description="Ontdek hoe ProWeb Studio te werk gaat bij het ontwikkelen van professionele websites. Van concept tot lancering in 6 stappen."
				url="https://prowebstudio.nl/werkwijze"
				mainEntity={{
					'@type': 'HowTo',
					name: 'Hoe ProWeb Studio een website ontwikkelt',
				}}
			/>

			<HowToSchema
				name="Hoe wij uw professionele website ontwikkelen"
				description="Een complete gids over ons website ontwikkelproces, van eerste contact tot oplevering en nazorg."
				totalTime="P14D"
				estimatedCost={{
					value: '1499-5999',
					currency: 'EUR',
					vatIncluded: true,
				}}
				steps={werkwijzeSteps}
				image="https://prowebstudio.nl/images/werkwijze-hero.jpg"
			/>

			{/* ...existing code... */}
		</>
	);
}