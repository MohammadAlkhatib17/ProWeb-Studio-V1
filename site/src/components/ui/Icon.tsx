'use client';

import {
    Rocket,
    Smartphone,
    Search,
    Zap,
    Pencil,
    ShoppingBag,
    TrendingUp,
    Settings,
    ShoppingCart,
    Wrench,
    FileText,
    MapPin,
    Palette,
    Globe,
    Sparkles,
    Gamepad2,
    Gem,
    Lightbulb,
    Star,
    Building2,
    Map,
    Mail,
    Phone,
    Home,
    Code,
    Eye,
    CreditCard,
    Target,
    Clock,
    Shield,
    Users,
    CheckCircle2,
    Handshake,
    type LucideIcon,
} from 'lucide-react';
import { memo } from 'react';

/**
 * Icon mapping from emoji/string identifiers to Lucide icons
 * This provides a unified icon system across the entire application
 */
const iconMap: Record<string, LucideIcon> = {
    // Emoji mappings (legacy support)
    '🚀': Rocket,
    '📱': Smartphone,
    '🔍': Search,
    '⚡': Zap,
    '✏️': Pencil,
    '🛍️': ShoppingBag,
    '📈': TrendingUp,
    '⚙️': Settings,
    '🛒': ShoppingCart,
    '🔧': Wrench,
    '📝': FileText,
    '📍': MapPin,
    '🎨': Palette,
    '🌐': Globe,
    '✨': Sparkles,
    '🎮': Gamepad2,
    '💎': Gem,
    '💡': Lightbulb,
    '⭐': Star,
    '🏛️': Building2,
    '🗺️': Map,
    '✉️': Mail,
    '📞': Phone,
    '🏠': Home,
    '🛠️': Wrench,
    '🏗️': Code,
    '👁️': Eye,
    '💳': CreditCard,
    '🎯': Target,
    '⏰': Clock,
    '🔒': Shield,
    '👥': Users,
    '✅': CheckCircle2,
    '🤝': Handshake,

    // Named icon mappings (preferred)
    'rocket': Rocket,
    'smartphone': Smartphone,
    'search': Search,
    'zap': Zap,
    'pencil': Pencil,
    'shopping-bag': ShoppingBag,
    'trending-up': TrendingUp,
    'settings': Settings,
    'shopping-cart': ShoppingCart,
    'wrench': Wrench,
    'file-text': FileText,
    'map-pin': MapPin,
    'palette': Palette,
    'globe': Globe,
    'sparkles': Sparkles,
    'gamepad': Gamepad2,
    'gem': Gem,
    'lightbulb': Lightbulb,
    'star': Star,
    'building': Building2,
    'map': Map,
    'mail': Mail,
    'phone': Phone,
    'home': Home,
    'code': Code,
    'eye': Eye,
    'credit-card': CreditCard,
    'target': Target,
    'clock': Clock,
    'shield': Shield,
    'users': Users,
    'check': CheckCircle2,
};

interface IconProps {
    name: string;
    className?: string;
    size?: number;
}

/**
 * Icon component that renders Lucide icons based on emoji or name identifier
 * Falls back to a default icon if not found
 */
function IconComponent({ name, className = 'w-6 h-6', size }: IconProps) {
    const IconElement = iconMap[name] || iconMap[name.toLowerCase()] || Sparkles;

    return <IconElement className={className} size={size} />;
}

export const Icon = memo(IconComponent);

/**
 * Get the Lucide icon component for a given emoji or name
 * Useful for cases where you need the component itself
 */
export function getIconComponent(name: string): LucideIcon {
    return iconMap[name] || iconMap[name.toLowerCase()] || Sparkles;
}

export default Icon;
