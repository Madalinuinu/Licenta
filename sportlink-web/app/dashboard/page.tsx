import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogOut, User, Mail } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile from public.users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <LogoutButton />
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-6 w-6 text-indigo-600" />
                Informații profil
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                {profile && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nume complet</p>
                      <p className="text-gray-900 font-medium">
                        {profile.full_name || 'Nu este setat'}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">ID utilizator</p>
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">✅ Autentificare reușită!</h2>
              <p className="text-gray-600">
                Ești conectat cu succes. Acest dashboard este protejat și doar utilizatorii autentificați
                pot accesa această pagină.
              </p>
            </div>

            {profile ? (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">✅ Profil în baza de date</h2>
                <p className="text-gray-600">
                  Profilul tău a fost creat cu succes în tabelul <code className="bg-blue-100 px-2 py-1 rounded">users</code>.
                </p>
                <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">⚠️ Profil în baza de date</h2>
                <p className="text-gray-600 mb-2">
                  Profilul nu a fost găsit în tabelul <code className="bg-yellow-100 px-2 py-1 rounded">users</code>.
                </p>
                {profileError && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm font-semibold text-red-800">Eroare:</p>
                    <p className="text-sm text-red-700">{profileError.message}</p>
                    <p className="text-xs text-red-600 mt-1">Code: {profileError.code}</p>
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-2">
                  <p className="mb-2">Verifică în Supabase că:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Tabelul <code className="bg-yellow-100 px-1 rounded">users</code> există</li>
                    <li>RLS (Row Level Security) este configurat corect</li>
                    <li>Politicile RLS permit citirea propriului profil</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
