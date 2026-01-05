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
 * Base DTO payload type (without metadata fields)
 */
type CompanyProfileDTOBase = Omit<CompanyProfileDTO, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'logoUrl'>

/**
 * Input type for CompanyProfileDTO that allows undefined for optional fields
 * Used for API payloads (from Zod validation) where fields can be undefined
 * Only companyName is required; all other fields are optional (can be undefined)
 */
export type CompanyProfileDTOInput = Omit<CompanyProfileDTOBase, 'contactName' | 'state' | 'email' | 'phone' | 'streetAddress' | 'city' | 'postalCode' | 'country' | 'taxId'> & {
  contactName?: string | null
  state?: string | null
  email?: string | null
  phone?: string | null
  streetAddress?: string | null
  city?: string | null
  postalCode?: string | null
  country?: string | null
  taxId?: string | null
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
 * Converts a DTO input (contactName, state) to Prisma format (contactPerson, stateProvince)
 * This is the single source of truth for converting from UI/API to Prisma format
 * Normalizes undefined values to null to ensure Prisma never receives undefined
 */
export function fromCompanyProfileDTO(
  dto: CompanyProfileDTOInput
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

