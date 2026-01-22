import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json({ 
          success: true, 
          message: 'Connection successful (table does not exist yet)' 
        })
      }
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connection successful' 
    })
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'Unknown error' 
    }, { status: 500 })
  }
}
