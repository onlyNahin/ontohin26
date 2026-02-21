export type EventStatus = 'Published' | 'Draft' | 'Archived';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: EventStatus;
  imageUrl?: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
}

export interface NavItem {
  label: string;
  href: string;
  isPage?: boolean;
}

export interface Announcement {
    id: string;
    title: string;
    date: string;
    content: string;
    priority: 'High' | 'Normal' | 'Low';
    imageUrl?: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
  color: string;
  bg: string;
}

export interface RedirectLink {
    id: string;
    label: string;
    url: string;
}

export interface AboutCard {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export interface AboutSectionData {
    title: string;
    subtitle: string;
    description: string;
    cards: AboutCard[];
}

export interface HistoryContentBlock {
    id: string;
    title: string;
    description: string;
}

export interface HistoryPageData {
    headerSubtitle: string;
    headerTitle: string;
    mainDescription: string;
    imageUrl: string;
    contentBlocks: HistoryContentBlock[];
    quote: string;
}

export interface FooterData {
    brandDescription: string;
    facebookUrl: string;
    instagramUrl: string;
    contactAddress: string;
    contactEmail: string;
    establishedYear: string;
    quoteText: string;
    copyrightText: string;
}

export interface HeroButton {
    text: string;
    url: string;
    type: 'scroll' | 'route' | 'external';
}

export interface HeroData {
    title: string;
    subtitle: string;
    imageUrl: string;
    button: HeroButton;
}

export interface EventRegistration {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    instagram: string;
    sscBatch: string;
    section: string;
}

export interface RegistrationSubmission extends EventRegistration {
    id: string;
    eventId: string;
    eventName: string;
    submittedAt: string;
}

// Custom Form Builder Types
export type FormFieldType = 'short_text' | 'long_text' | 'number' | 'multiple_choice' | 'email' | 'transaction_id' | 'payment_method' | 'file_upload' | 'description';

export interface FormField {
    id: string;
    type: FormFieldType;
    label: string;
    required: boolean;
    options?: string[]; // For multiple choice or payment method
    helpText?: string;
}

export interface CustomForm {
    id: string;
    title: string;
    description: string;
    fields: FormField[];
    status: 'published' | 'draft';
    createdAt: string;
    shareToken?: string;
}

export interface FormSubmission {
    id: string;
    formId: string;
    formTitle: string;
    submittedAt: string;
    data: Record<string, any>;
}