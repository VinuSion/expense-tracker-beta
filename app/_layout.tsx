import { useState, useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useDBStore } from '@/store/dbStore'
import { StatusBar } from 'expo-status-bar'

import LoadingScreen from '@/components/LoadingScreen'

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)
  const { dbExists, updateDBState } = useDBStore()
  const router = useRouter() // Navigation controller
  const segments = useSegments() // Current route segments

  // Add route guard
  useEffect(() => {
    if (!isReady) return

    const inTabsGroup = segments[0] === '(tabs)'
    console.log('Route Check:', { inTabsGroup, dbExists })

    if (!dbExists && inTabsGroup) {
      router.replace('/welcome')
    }
  }, [isReady, segments, dbExists])

  // Initialize database state and determine initial route
  useEffect(() => {
    async function prepareApp() {
      try {
        await updateDBState()
        setIsReady(true)
      } catch (error) {
        console.error('Error initializing database state:', error)
      }
    }
    prepareApp()
  }, [])

  // Show loading screen until we're ready
  if (!isReady) {
    return <LoadingScreen />
  }

  return (
    <>
      <StatusBar style="light" />
      {dbExists ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack>
      )}
    </>
  )
}
