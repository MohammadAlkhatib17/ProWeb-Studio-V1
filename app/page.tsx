import { WebPageSchema } from '@/components/schema/WebPageSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import { ServiceSchema } from '@/components/schema/ServiceSchema';

const homepageFAQs = [
	{
		question: 'Hoeveel kost een website bij ProWeb Studio?',
		answer:
			'Onze websiteprijzen beginnen vanaf €1.499 incl. BTW voor een basis WordPress website. Voor maatwerk oplossingen variëren de kosten tussen €2.500 - €10.000 incl. BTW, afhankelijk van de complexiteit en functionaliteiten.',
	},
	{
		question: 'Hoe lang duurt het om een website te maken?',
		answer:
			'Een standaard WordPress website is binnen 2-3 weken klaar. Voor complexere projecten met maatwerk functionaliteiten rekenen we 4-8 weken ontwikkeltijd.',
	},
	{
		question: 'Wordt de website geoptimaliseerd voor zoekmachines?',
		answer:
			'Ja, alle websites worden standaard geleverd met basis SEO-optimalisatie, inclusief meta tags, schema markup, sitemap en snelheidsoptimalisatie.',
	},
	{
		question: 'Kan ik zelf mijn website beheren na oplevering?',
		answer:
			'Absoluut! We leveren een gebruiksvriendelijk CMS (WordPress) met training, zodat u zelf eenvoudig content kunt aanpassen zonder technische kennis.',
	},
	{
		question: 'Bieden jullie ook onderhoud en support?',
		answer:
			'Ja, we bieden onderhoudscontracten vanaf €49 per maand incl. BTW. Dit omvat updates, backups, monitoring en maandelijkse support.',
	},
];

export default function Home() {
	return (
		<>
			<WebPageSchema
				name="ProWeb Studio - Professionele Websites & Webontwikkeling"
				description="ProWeb Studio ontwikkelt professionele WordPress websites voor het MKB in Nederland. Responsive design, SEO-geoptimaliseerd en betaalbaar."
				url="https://prowebstudio.nl"
				mainEntity={{
					'@type': 'Organization',
					name: 'ProWeb Studio',
					url: 'https://prowebstudio.nl',
				}}
			/>

			<FAQSchema faqs={homepageFAQs} />

			<ServiceSchema
				name="WordPress Website Ontwikkeling"
				description="Professionele WordPress websites op maat voor het Nederlandse MKB"
				provider="ProWeb Studio"
				serviceType="Webontwikkeling"
				areaServed={['Nederland', 'België']}
				priceRange={{
					minPrice: 1499,
					maxPrice: 10000,
					currency: 'EUR',
					vatRate: 21,
				}}
				offers={[
					{
						name: 'Starter Pakket',
						price: 1499,
						description: 'Basis WordPress website met 5 paginas',
					},
					{
						name: 'Professional Pakket',
						price: 2999,
						description: 'Uitgebreide website met webshop functionaliteit',
					},
					{
						name: 'Enterprise Pakket',
						price: 5999,
						description: 'Maatwerk oplossing met geavanceerde features',
					},
				]}
			/>

			{/* ...existing code... */}
		</>
	);
}