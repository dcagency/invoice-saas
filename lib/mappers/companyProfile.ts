import { CompanyProfile } from '@prisma/client'

/**
 * DTO (Data Transfer Object) for Company Profile UI/API
 * Uses contactName and state (user-friendly names) instead of contactPerson and stateProvince
 */
export interface CompanyProfileDTO {
  id: string
  userId: string
  companyName: string
  contactName: string | null
  email: string | null
  phone: string | null
  streetAddress: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  taxId: string | null
  logoUrl: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Converts a Prisma CompanyProfile (contactPerson, stateProvince) to DTO format (contactName, state)
 * This is the single source of truth for converting from Prisma to UI/API format
 */
export function toCompanyProfileDTO(profile: CompanyProfile): CompanyProfileDTO {
  return {
    ...profile,
    contactName: profile.contactPerson ?? null,
    state: profile.stateProvince ?? null,
  }
}

/**
 * Converts a DTO (contactName, state) to Prisma format (contactPerson, stateProvince)
 * This is the single source of truth for converting from UI/API to Prisma format
 */
export function fromCompanyProfileDTO(
  dto: Omit<CompanyProfileDTO, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'logoUrl'>
): Omit<CompanyProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'logoUrl'> {
  return {
    companyName: dto.companyName,
    contactPerson: dto.contactName ?? null,
    email: dto.email ?? null,
    phone: dto.phone ?? null,
    streetAddress: dto.streetAddress ?? null,
    city: dto.city ?? null,
    stateProvince: dto.state ?? null,
    postalCode: dto.postalCode ?? null,
    country: dto.country ?? null,
    taxId: dto.taxId ?? null,
  }
}

