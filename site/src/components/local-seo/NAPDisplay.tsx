import React from "react";
import {
  localBusinessData,
  type LocalBusinessData,
} from "@/config/local-seo.config";

interface NAPDisplayProps {
  variant?: "full" | "compact" | "inline" | "schema";
  showHours?: boolean;
  className?: string;
  customData?: Partial<LocalBusinessData>;
}

export function NAPDisplay({
  variant = "full",
  showHours = false,
  className = "",
  customData,
}: NAPDisplayProps) {
  const businessData = customData
    ? { ...localBusinessData, ...customData }
    : localBusinessData;

  switch (variant) {
    case "schema":
      // This returns JSON-LD structured data for schema markup
      return null; // Handled by separate schema component

    case "inline":
      return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
          <span>{businessData.name}</span>
          <span>•</span>
          <span>{businessData.phone}</span>
          <span>•</span>
          <span>{businessData.email}</span>
        </span>
      );

    case "compact":
      return (
        <div className={`space-y-1 text-sm ${className}`}>
          <div className="font-semibold">{businessData.name}</div>
          <div className="text-gray-600">
            {businessData.address.streetAddress},{" "}
            {businessData.address.addressLocality}
          </div>
          <div className="flex gap-4">
            <a
              href={`tel:${businessData.phone}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {businessData.phone}
            </a>
            <a
              href={`mailto:${businessData.email}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {businessData.email}
            </a>
          </div>
        </div>
      );

    case "full":
    default:
      return (
        <div className={`space-y-3 ${className}`}>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {businessData.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {businessData.legalName}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-1 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <address className="not-italic text-gray-700 dark:text-gray-300">
                {businessData.address.streetAddress}
                <br />
                {businessData.address.postalCode}{" "}
                {businessData.address.addressLocality}
                <br />
                {businessData.address.addressRegion},{" "}
                {businessData.address.addressCountry}
              </address>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <a
                href={`tel:${businessData.phone}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {businessData.phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a
                href={`mailto:${businessData.email}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {businessData.email}
              </a>
            </div>
          </div>

          {showHours && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Openingstijden
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-600 dark:text-gray-400">
                <span>Maandag:</span>
                <span>{businessData.businessHours.monday}</span>
                <span>Dinsdag:</span>
                <span>{businessData.businessHours.tuesday}</span>
                <span>Woensdag:</span>
                <span>{businessData.businessHours.wednesday}</span>
                <span>Donderdag:</span>
                <span>{businessData.businessHours.thursday}</span>
                <span>Vrijdag:</span>
                <span>{businessData.businessHours.friday}</span>
                {businessData.businessHours.saturday && (
                  <>
                    <span>Zaterdag:</span>
                    <span>{businessData.businessHours.saturday}</span>
                  </>
                )}
                {businessData.businessHours.sunday && (
                  <>
                    <span>Zondag:</span>
                    <span>{businessData.businessHours.sunday}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>KvK: {businessData.kvkNumber}</span>
              <span>BTW: {businessData.vatNumber}</span>
            </div>
          </div>
        </div>
      );
  }
}

export function BusinessHours({
  hours = localBusinessData.businessHours,
  className = "",
}: {
  hours?: LocalBusinessData["businessHours"];
  className?: string;
}) {
  const daysOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayNames = {
    monday: "Maandag",
    tuesday: "Dinsdag",
    wednesday: "Woensdag",
    thursday: "Donderdag",
    friday: "Vrijdag",
    saturday: "Zaterdag",
    sunday: "Zondag",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-medium text-gray-900 dark:text-white">
        Openingstijden
      </h4>
      <div className="space-y-1">
        {daysOrder.map((day) => {
          const timeSlot = hours[day as keyof typeof hours];
          if (!timeSlot) return null;

          return (
            <div key={day} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {dayNames[day as keyof typeof dayNames]}:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {timeSlot}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ContactInfo({
  data = localBusinessData,
  variant = "horizontal",
  className = "",
}: {
  data?: LocalBusinessData;
  variant?: "horizontal" | "vertical";
  className?: string;
}) {
  if (variant === "vertical") {
    return (
      <div className={`space-y-3 ${className}`}>
        <a
          href={`tel:${data.phone}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Bel direct
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {data.phone}
            </div>
          </div>
        </a>

        <a
          href={`mailto:${data.email}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Stuur email
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {data.email}
            </div>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <a
        href={`tel:${data.phone}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        {data.phone}
      </a>

      <a
        href={`mailto:${data.email}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        {data.email}
      </a>
    </div>
  );
}

export default NAPDisplay;
