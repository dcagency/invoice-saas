'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CompanyProfile {
  companyName: string | null
  contactName: string | null
  email: string | null
  phone: string | null
  streetAddress: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  taxId: string | null
}

function checkProfileComplete(profile: CompanyProfile | null): boolean {
  if (!profile) return false
  return !!(
    profile.companyName &&
    profile.email &&
    profile.streetAddress &&
    profile.city &&
    profile.postalCode &&
    profile.country
  )
}

export function useRequireCompleteProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/company/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    if (!isLoading && profile) {
      const isComplete = checkProfileComplete(profile)
      if (!isComplete) {
        alert('Please complete your company profile first')
        router.push('/company/edit')
      }
    }
  }, [profile, isLoading, router])

  return {
    isLoading,
    isComplete: checkProfileComplete(profile),
    profile,
  }
}


