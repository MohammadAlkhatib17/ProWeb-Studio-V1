import { locationMetadata } from "@/lib/metadata";

interface PaginationMetaTagsProps {
  current: number;
  total: number;
  baseUrl: string;
}

export function PaginationMetaTags({
  current,
  total,
  baseUrl,
}: PaginationMetaTagsProps) {
  const prevPage = current > 1 ? current - 1 : null;
  const nextPage = current < total ? current + 1 : null;

  return (
    <>
      {prevPage && (
        <link
          rel="prev"
          href={prevPage === 1 ? baseUrl : `${baseUrl}?page=${prevPage}`}
        />
      )}
      {nextPage && <link rel="next" href={`${baseUrl}?page=${nextPage}`} />}
    </>
  );
}

interface HrefLangTagsProps {
  currentPath: string;
  locations?: string[];
  includeDefault?: boolean;
}

export function HrefLangTags({
  currentPath,
  locations = [],
  includeDefault = true,
}: HrefLangTagsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prowebstudio.nl";

  return (
    <>
      {/* Primary Dutch market targeting */}
      <link rel="alternate" hrefLang="nl" href={`${baseUrl}${currentPath}`} />
      <link
        rel="alternate"
        hrefLang="nl-NL"
        href={`${baseUrl}${currentPath}`}
      />

      {/* Location-specific hreflang for better geo-targeting */}
      {locations.map((location) => {
        const locationData =
          locationMetadata[location as keyof typeof locationMetadata];
        if (locationData) {
          return (
            <link
              key={location}
              rel="alternate"
              hrefLang={`nl-${locationData.region.replace(" ", "-")}`}
              href={`${baseUrl}/locaties/${location}`}
            />
          );
        }
        return null;
      })}

      {/* Default language fallback */}
      {includeDefault && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}${currentPath}`}
        />
      )}

      {/* Secondary market languages for future expansion */}
      <link
        rel="alternate"
        hrefLang="en"
        href={`${baseUrl}/en${currentPath}`}
      />
      <link
        rel="alternate"
        hrefLang="de"
        href={`${baseUrl}/de${currentPath}`}
      />
      <link
        rel="alternate"
        hrefLang="fr"
        href={`${baseUrl}/fr${currentPath}`}
      />
    </>
  );
}

interface ContentFreshnessMetaProps {
  publishedTime?: Date | string;
  modifiedTime?: Date | string;
  expirationTime?: Date | string;
}

export function ContentFreshnessMeta({
  publishedTime,
  modifiedTime,
  expirationTime,
}: ContentFreshnessMetaProps) {
  const publishedISO = publishedTime
    ? publishedTime instanceof Date
      ? publishedTime.toISOString()
      : publishedTime
    : new Date().toISOString();

  const modifiedISO = modifiedTime
    ? modifiedTime instanceof Date
      ? modifiedTime.toISOString()
      : modifiedTime
    : new Date().toISOString();

  return (
    <>
      <meta property="article:published_time" content={publishedISO} />
      <meta property="article:modified_time" content={modifiedISO} />
      {expirationTime && (
        <meta
          property="article:expiration_time"
          content={
            expirationTime instanceof Date
              ? expirationTime.toISOString()
              : expirationTime
          }
        />
      )}
      <meta name="date" content={modifiedISO} />
      <meta name="last-modified" content={modifiedISO} />
      <meta
        httpEquiv="last-modified"
        content={new Date(modifiedISO).toUTCString()}
      />
    </>
  );
}

interface GeographicMetaTagsProps {
  location?: keyof typeof locationMetadata;
  customCoordinates?: {
    lat: string;
    lng: string;
  };
  placename?: string;
}

export function GeographicMetaTags({
  location,
  customCoordinates,
  placename,
}: GeographicMetaTagsProps) {
  let coordinates;
  let place;

  if (location && locationMetadata[location]) {
    const locationData = locationMetadata[location];
    coordinates = locationData.coordinates;
    place = locationData.city;
  } else if (customCoordinates) {
    coordinates = customCoordinates;
    place = placename || "Netherlands";
  } else {
    // Default to Netherlands center
    coordinates = { lat: "52.3676", lng: "4.9041" };
    place = "Netherlands";
  }

  return (
    <>
      <meta name="geo.region" content="NL" />
      <meta name="geo.placename" content={place} />
      <meta
        name="geo.position"
        content={`${coordinates.lat};${coordinates.lng}`}
      />
      <meta name="ICBM" content={`${coordinates.lat}, ${coordinates.lng}`} />
      <meta name="geo.country" content="Netherlands" />
    </>
  );
}

interface SocialVerificationMetaProps {
  facebookDomainVerification?: string;
  googleSiteVerification?: string;
  bingWebmasterVerification?: string;
  yandexVerification?: string;
  pinterestVerification?: string;
}

export function SocialVerificationMeta({
  facebookDomainVerification,
  googleSiteVerification,
  bingWebmasterVerification,
  yandexVerification,
  pinterestVerification,
}: SocialVerificationMetaProps) {
  return (
    <>
      {facebookDomainVerification && (
        <meta
          name="facebook-domain-verification"
          content={facebookDomainVerification}
        />
      )}
      {googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      )}
      {bingWebmasterVerification && (
        <meta name="msvalidate.01" content={bingWebmasterVerification} />
      )}
      {yandexVerification && (
        <meta name="yandex-verification" content={yandexVerification} />
      )}
      {pinterestVerification && (
        <meta name="p:domain_verify" content={pinterestVerification} />
      )}
    </>
  );
}

interface BusinessMetaTagsProps {
  businessName: string;
  phone: string;
  email: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  businessType?: string;
  priceRange?: string;
}

export function BusinessMetaTags({
  phone,
  email,
  address,
  businessType = "Web Design",
  priceRange = "€€€",
}: Omit<BusinessMetaTagsProps, "businessName">) {
  return (
    <>
      <meta name="business:contact_data:phone_number" content={phone} />
      <meta name="business:contact_data:email" content={email} />
      <meta
        name="business:contact_data:website"
        content="https://prowebstudio.nl"
      />

      {address && (
        <>
          <meta
            name="business:contact_data:street_address"
            content={address.street}
          />
          <meta name="business:contact_data:locality" content={address.city} />
          <meta name="business:contact_data:region" content={address.region} />
          <meta
            name="business:contact_data:postal_code"
            content={address.postalCode}
          />
          <meta
            name="business:contact_data:country_name"
            content={address.country}
          />
        </>
      )}

      <meta name="business:hours:day" content="monday" />
      <meta name="business:hours:start" content="09:00" />
      <meta name="business:hours:end" content="17:00" />

      <meta name="business:hours:day" content="tuesday" />
      <meta name="business:hours:start" content="09:00" />
      <meta name="business:hours:end" content="17:00" />

      <meta name="business:hours:day" content="wednesday" />
      <meta name="business:hours:start" content="09:00" />
      <meta name="business:hours:end" content="17:00" />

      <meta name="business:hours:day" content="thursday" />
      <meta name="business:hours:start" content="09:00" />
      <meta name="business:hours:end" content="17:00" />

      <meta name="business:hours:day" content="friday" />
      <meta name="business:hours:start" content="09:00" />
      <meta name="business:hours:end" content="17:00" />

      <meta property="business:business_type" content={businessType} />
      <meta property="business:price_range" content={priceRange} />
    </>
  );
}
