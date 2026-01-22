'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [clientStatus, setClientStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [clientError, setClientError] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    async function testClient() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('users').select('count').limit(1)
        
        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            setClientStatus('success')
            setClientError('Tabelul nu există încă ')
          } else {
            setClientStatus('error')
            setClientError(error.message)
          }
        } else {
          setClientStatus('success')
        }
      } catch (err: any) {
        setClientStatus('error')
        setClientError(err.message || 'Eroare necunoscută')
      }
    }
    testClient()
  }, [])

  // Test server-side connection
  useEffect(() => {
    async function testServer() {
      try {
        const response = await fetch('/api/test-supabase')
        const data = await response.json()
        
        if (data.success) {
          setServerStatus('success')
        } else {
          setServerStatus('error')
          setServerError(data.error || 'Eroare necunoscută')
        }
      } catch (err: any) {
        setServerStatus('error')
        setServerError(err.message || 'Eroare necunoscută')
      }
    }
    testServer()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Supabase Connection</h1>
        
        <div className="space-y-6">
          {/* Client-side test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Client-side Test</h2>
            <div className="flex items-center gap-4">
              {clientStatus === 'loading' && (
                <div className="text-blue-600">⏳ Testing...</div>
              )}
              {clientStatus === 'success' && (
                <div className="text-green-600">✅ Connection successful!</div>
              )}
              {clientStatus === 'error' && (
                <div className="text-red-600">❌ Connection failed!</div>
              )}
            </div>
            {clientError && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                {clientError}
              </div>
            )}
          </div>

          {/* Server-side test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Server-side Test</h2>
            <div className="flex items-center gap-4">
              {serverStatus === 'loading' && (
                <div className="text-blue-600">⏳ Testing...</div>
              )}
              {serverStatus === 'success' && (
                <div className="text-green-600">✅ Connection successful!</div>
              )}
              {serverStatus === 'error' && (
                <div className="text-red-600">❌ Connection failed!</div>
              )}
            </div>
            {serverError && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                {serverError}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2">📝 Note:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Dacă vezi "Tabelul nu există încă" - conexiunea funcționează corect!</li>
              <li>Dacă vezi erori de autentificare - verifică cheia API în Supabase</li>
              <li>Dacă vezi erori de rețea - verifică URL-ul Supabase</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
