import { HowTo, WithContext } from 'schema-dts';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime: string;
  estimatedCost?: {
    value: string;
    currency: string;
    vatIncluded: boolean;
  };
  steps: HowToStep[];
  image?: string;
}

export function HowToSchema({
  name,
  description,
  totalTime,
  estimatedCost,
  steps,
  image
}: HowToSchemaProps) {
  const schema: WithContext<HowTo> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    // Add keywords to schema where appropriate
    keywords: 'website laten maken, webdesign nederland, 3d websites, wordpress ontwikkeling',
    ...(image && { image }),
    ...(estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: estimatedCost.currency,
        value: estimatedCost.value,
        // Dutch VAT notation
        name: estimatedCost.vatIncluded ? `€${estimatedCost.value} incl. BTW` : `€${estimatedCost.value} excl. BTW`
      }
    }),
    supply: [],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'WordPress CMS voor website ontwikkeling'
      },
      {
        '@type': 'HowToTool',
        name: 'Responsive Design Framework voor webdesign'
      },
      {
        '@type': 'HowToTool',
        name: 'Three.js voor 3D websites'
      }
    ],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
