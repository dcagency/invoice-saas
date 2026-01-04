import { CompanyProfile } from '@prisma/client'

/**
 * Vérifie si un profil d'entreprise est complet selon les critères définis.
 * Un profil est complet si les champs suivants sont renseignés:
 * - companyName (non vide)
 * - streetAddress (non vide)
 * - city (non vide)
 * - postalCode (non vide)
 * - country (non vide)
 */
export function isProfileComplete(profile: CompanyProfile | null): boolean {
  if (!profile) return false

  return !!(
    profile.companyName &&
    profile.companyName.trim().length > 0 &&
    profile.streetAddress &&
    profile.streetAddress.trim().length > 0 &&
    profile.city &&
    profile.city.trim().length > 0 &&
    profile.postalCode &&
    profile.postalCode.trim().length > 0 &&
    profile.country &&
    profile.country.trim().length > 0
  )
}


