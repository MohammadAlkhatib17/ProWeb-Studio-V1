/**
 * Local SEO Components
 * 
 * Components for Dutch market local SEO implementation
 * Includes NAP (Name, Address, Phone) consistency, JSON-LD structured data,
 * and city/location selectors.
 */

export { default as DutchBusinessInfo } from './DutchBusinessInfo';
export type { DutchBusinessInfoProps } from './DutchBusinessInfo';

export { default as CitySelector } from './CitySelector';
export type { CitySelectorProps, City } from './CitySelector';

export { default as LocalBusinessJSON, NAP_DATA } from './LocalBusinessJSON';
export type { LocalBusinessJSONProps } from './LocalBusinessJSON';
