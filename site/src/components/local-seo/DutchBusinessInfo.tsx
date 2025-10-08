import React from 'react';
import { dutchBusinessInfo, localBusinessData } from '@/config/local-seo.config';

interface DutchBusinessHolidaysProps {
  year?: number;
  showUpcoming?: boolean;
  className?: string;
}

export function DutchBusinessHolidays({ 
  year = new Date().getFullYear(), 
  showUpcoming = true,
  className = '' 
}: DutchBusinessHolidaysProps) {
  const currentDate = new Date();
  const holidays = dutchBusinessInfo.nationalHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getFullYear() === year;
  });

  const upcomingHolidays = showUpcoming 
    ? holidays.filter(holiday => new Date(holiday.date) >= currentDate).slice(0, 3)
    : holidays;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-semibold text-gray-900 dark:text-white">
        {showUpcoming ? 'Komende Feestdagen' : `Nederlandse Feestdagen ${year}`}
      </h4>
      
      <div className="space-y-2">
        {upcomingHolidays.map((holiday, index) => {
          const isToday = new Date(holiday.date).toDateString() === currentDate.toDateString();
          const isPast = new Date(holiday.date) < currentDate;
          
          return (
            <div 
              key={index}
              className={`flex justify-between items-center p-3 rounded-lg ${
                isToday 
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : isPast
                  ? 'bg-gray-50 dark:bg-gray-800 opacity-60'
                  : 'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div>
                <div className={`font-medium ${
                  isToday 
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {holiday.name}
                </div>
                <div className={`text-sm ${
                  isToday
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {formatDate(holiday.date)}
                </div>
              </div>
              
              {isToday && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Vandaag</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showUpcoming && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Op Nederlandse feestdagen zijn wij gesloten of beperkt bereikbaar.
          </p>
        </div>
      )}
    </div>
  );
}

interface ExtendedBusinessHoursProps {
  className?: string;
  showHolidays?: boolean;
  showSpecialHours?: boolean;
}

export function ExtendedBusinessHours({ 
  className = '',
  showHolidays = true,
  showSpecialHours = true
}: ExtendedBusinessHoursProps) {
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  const isHoliday = dutchBusinessInfo.nationalHolidays.some(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.toDateString() === currentDate.toDateString();
  });

  const businessHours = localBusinessData.businessHours;
  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = {
    monday: 'Maandag',
    tuesday: 'Dinsdag',
    wednesday: 'Woensdag', 
    thursday: 'Donderdag',
    friday: 'Vrijdag',
    saturday: 'Zaterdag',
    sunday: 'Zondag'
  };

  const getCurrentStatus = () => {
    if (isHoliday) {
      return { status: 'closed', message: 'Gesloten wegens feestdag' };
    }

    const currentHours = businessHours[currentDay as keyof typeof businessHours];
    if (!currentHours) {
      return { status: 'closed', message: 'Vandaag gesloten' };
    }

    // Parse current time and business hours
    const now = currentDate.getHours() * 60 + currentDate.getMinutes();
    const [openTime, closeTime] = currentHours.split('-');
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    if (now >= openMinutes && now < closeMinutes) {
      const minutesUntilClose = closeMinutes - now;
      if (minutesUntilClose <= 60) {
        return { status: 'closing-soon', message: `Sluit over ${minutesUntilClose} minuten` };
      }
      return { status: 'open', message: `Open tot ${closeTime}` };
    } else if (now < openMinutes) {
      return { status: 'closed', message: `Opent om ${openTime}` };
    } else {
      return { status: 'closed', message: 'Gesloten' };
    }
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          Openingstijden
        </h4>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          currentStatus.status === 'open' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            : currentStatus.status === 'closing-soon'
            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentStatus.status === 'open' 
              ? 'bg-green-500'
              : currentStatus.status === 'closing-soon'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`} />
          {currentStatus.message}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {daysOrder.map(day => {
          const timeSlot = businessHours[day as keyof typeof businessHours];
          const isToday = day === currentDay;
          
          return (
            <div key={day} className={`flex justify-between items-center py-2 px-3 rounded ${
              isToday ? 'bg-blue-50 dark:bg-blue-900/20 font-medium' : ''
            }`}>
              <span className={`${
                isToday 
                  ? 'text-blue-900 dark:text-blue-100' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {dayNames[day as keyof typeof dayNames]}
              </span>
              <span className={`${
                isToday 
                  ? 'text-blue-900 dark:text-blue-100 font-semibold' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {timeSlot || 'Gesloten'}
              </span>
            </div>
          );
        })}
      </div>

      {showSpecialHours && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Speciale Tijden
            </h5>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <div>• Spoedprojecten: 24/7 beschikbaar</div>
              <div>• Weekend ondersteuning: Op afspraak</div>
              <div>• Online consultaties: Altijd mogelijk</div>
            </div>
          </div>
        </div>
      )}

      {showHolidays && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <DutchBusinessHolidays showUpcoming={true} />
        </div>
      )}
    </div>
  );
}

interface BusinessRegistrationInfoProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export function BusinessRegistrationInfo({ 
  className = '',
  variant = 'full'
}: BusinessRegistrationInfoProps) {
  const businessCategories = dutchBusinessInfo.businessCategories;
  
  if (variant === 'compact') {
    return (
      <div className={`text-xs text-gray-500 dark:text-gray-400 space-y-1 ${className}`}>
        <div>KvK: {localBusinessData.kvkNumber}</div>
        <div>BTW: {localBusinessData.vatNumber}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-semibold text-gray-900 dark:text-white">
        Bedrijfsinformatie
      </h4>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Handelsnaam
            </dt>
            <dd className="text-gray-900 dark:text-white">
              {localBusinessData.name}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rechtsvorm
            </dt>
            <dd className="text-gray-900 dark:text-white">
              {localBusinessData.legalName}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
              KvK-nummer
            </dt>
            <dd className="text-gray-900 dark:text-white font-mono">
              {localBusinessData.kvkNumber}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
              BTW-nummer
            </dt>
            <dd className="text-gray-900 dark:text-white font-mono">
              {localBusinessData.vatNumber}
            </dd>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              SBI-codes (Activiteiten)
            </dt>
            <dd className="space-y-2">
              {businessCategories.map((category, index) => (
                <div key={index} className="text-sm">
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {category.code}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    {category.name}
                  </span>
                </div>
              ))}
            </dd>
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Alle bedrijfsgegevens zijn geregistreerd bij de Nederlandse Kamer van Koophandel.
          Wijzigingen voorbehouden.
        </p>
      </div>
    </div>
  );
}

export default ExtendedBusinessHours;