// Re-export database types for convenience
export type {
  Project,
  ProjectInsert,
  ProjectUpdate,
  Service,
  ServiceInsert,
  ServiceUpdate,
  Client,
  ClientInsert,
  ClientUpdate,
  Stat,
  StatInsert,
  StatUpdate,
  CompanyValue,
  CompanyValueInsert,
  CompanyValueUpdate,
  ContactInfo,
  ContactInfoInsert,
  ContactInfoUpdate,
  AboutContent,
  AboutContentInsert,
  AboutContentUpdate,
  Category,
  CategoryInsert,
  CategoryUpdate,
  Database,
} from './database';

// Application-specific types (not in database)
export interface NavItem {
  label: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}
