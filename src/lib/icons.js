/**
 * Icon Mapping Utility
 * Maps common categories/concepts to Phosphor Icons
 * Centralized icon management for consistency across the app
 */

import {
  // Common Actions
  CheckCircle,
  XCircle,
  Circle,
  Clock,
  Star,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  CaretRight,
  CaretLeft,
  X,

  // Wedding Categories
  Buildings,
  ForkKnife,
  Dress,
  Camera,
  VideoCamera,
  Flower,
  MusicNotes,
  Car,
  EnvelopeSimple,
  Gift,
  Confetti,

  // Wedding Elements
  Crown,
  Diamond,
  Sparkle,
  Users,
  User,
  CalendarBlank,
  MapPin,
  Phone,
  At,
  CurrencyDollar,

  // UI Elements
  MagnifyingGlass,
  Funnel,
  DotsThree,
  List,
  GridFour,
  Download,
  Upload,
  Printer,

  // Priorities & Values
  Palette,
  BookOpen,
  Lightbulb,
  PencilLine,

  // Status
  CheckSquare,
} from "@phosphor-icons/react";

/**
 * Icon Categories Map
 */
export const ICONS = {
  // Common Actions
  actions: {
    check: CheckCircle,
    close: XCircle,
    empty: Circle,
    pending: Clock,
    favorite: Star,
    love: Heart,
    add: Plus,
    remove: Minus,
    next: ArrowRight,
    prev: ArrowLeft,
    forward: CaretRight,
    back: CaretLeft,
    x: X,
  },

  // Wedding Vendor Categories
  vendors: {
    venue: Buildings,
    catering: ForkKnife,
    attire: Dress,
    photography: Camera,
    videography: VideoCamera,
    decor: Flower,
    entertainment: MusicNotes,
    transportation: Car,
    invitations: EnvelopeSimple,
    gifts: Gift,
    miscellaneous: Confetti,
  },

  // Wedding Elements
  wedding: {
    traditional: Crown,
    modern: Diamond,
    fusion: Sparkle,
    guests: Users,
    guest: User,
    date: CalendarBlank,
    location: MapPin,
    contact: Phone,
    email: At,
    budget: CurrencyDollar,
  },

  // UI Elements
  ui: {
    search: MagnifyingGlass,
    filter: Funnel,
    menu: DotsThree,
    list: List,
    grid: GridFour,
    download: Download,
    upload: Upload,
    print: Printer,
  },

  // Priorities & Values
  values: {
    cultural: Palette,
    faith: BookOpen,
    creativity: Lightbulb,
    expression: PencilLine,
    family: Users,
    personal: Heart,
  },

  // Status
  status: {
    complete: CheckCircle,
    incomplete: Circle,
    inProgress: Clock,
    cancelled: XCircle,
    booked: CheckSquare,
    researching: MagnifyingGlass,
  },
};

/**
 * Get icon by category and name
 * @param {string} category - Icon category (vendors, actions, etc.)
 * @param {string} name - Icon name within category
 * @param {number} size - Icon size (default: 24)
 * @param {string} weight - Icon weight (default: "regular")
 * @returns {JSX.Element} Phosphor Icon component
 */
export function getIcon(category, name, size = 24, weight = "regular") {
  const IconComponent = ICONS[category]?.[name];
  return IconComponent ? <IconComponent size={size} weight={weight} /> : null;
}

/**
 * Get vendor icon by category name
 * @param {string} category - Vendor category (lowercase)
 * @returns {React.Component} Icon component
 */
export function getVendorIcon(category) {
  const categoryMap = {
    venue: Buildings,
    catering: ForkKnife,
    attire: Dress,
    photography: Camera,
    videography: VideoCamera,
    decor: Flower,
    entertainment: MusicNotes,
    transportation: Car,
    invitations: EnvelopeSimple,
    gifts: Gift,
    miscellaneous: Confetti,
    // Aliases
    food: ForkKnife,
    music: MusicNotes,
    dress: Dress,
    photo: Camera,
    video: VideoCamera,
    flowers: Flower,
  };

  return categoryMap[category.toLowerCase()] || Confetti;
}

/**
 * Get status icon by status name
 * @param {string} status - Status name (lowercase)
 * @returns {React.Component} Icon component
 */
export function getStatusIcon(status) {
  const statusMap = {
    complete: CheckCircle,
    completed: CheckCircle,
    done: CheckCircle,
    incomplete: Circle,
    pending: Clock,
    "in-progress": Clock,
    "in progress": Clock,
    cancelled: XCircle,
    canceled: XCircle,
    booked: CheckSquare,
    confirmed: CheckSquare,
    researching: MagnifyingGlass,
    research: MagnifyingGlass,
  };

  return statusMap[status.toLowerCase()] || Circle;
}

export default ICONS;
