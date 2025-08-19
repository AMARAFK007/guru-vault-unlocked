import { supabase } from './supabase'

export async function setupDatabase() {
  console.log('🚀 Setting up LearnforLess database...')

  try {
    // Insert sample courses (tables should be created manually in Supabase)
    console.log('Adding sample courses...')
    const { error: insertError } = await supabase
      .from('courses')
      .upsert([
        {
          name: 'Hustlers University Complete',
          description: 'Complete Andrew Tate course collection',
          category: 'Business',
          instructor: 'Andrew Tate',
          size_gb: 5.2
        },
        {
          name: 'Digital Marketing Mastery',
          description: 'Iman Gadzhi complete marketing course',
          category: 'Marketing',
          instructor: 'Iman Gadzhi',
          size_gb: 3.8
        },
        {
          name: 'E-commerce Empire',
          description: 'Luke Belmar dropshipping and e-commerce',
          category: 'Business',
          instructor: 'Luke Belmar',
          size_gb: 4.1
        },
        {
          name: 'Trading Masterclass',
          description: 'Complete trading strategy course',
          category: 'Trading',
          instructor: 'Various',
          size_gb: 6.5
        },
        {
          name: 'Self Improvement Bundle',
          description: 'Mindset and personal development',
          category: 'Self-Improvement',
          instructor: 'Various',
          size_gb: 2.3
        }
      ], { onConflict: 'name' })

    if (insertError) {
      console.log('ℹ️ Sample courses: ', insertError.message)
      // This might fail if tables don't exist yet, which is expected
    } else {
      console.log('✅ Sample courses added successfully!')
    }

    // Test basic operations
    console.log('Testing database operations...')
    
    // Test reviews table
    const { error: reviewTest } = await supabase
      .from('reviews')
      .select('count')
      .limit(1)
    
    if (reviewTest) {
      console.log('Reviews table test:', reviewTest.message)
    } else {
      console.log('✅ Reviews table accessible')
    }

    // Test orders table  
    const { error: orderTest } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (orderTest) {
      console.log('Orders table test:', orderTest.message)
    } else {
      console.log('✅ Orders table accessible')
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return { success: false, error }
  }
}

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('courses').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error)
      return false
    }
    
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return false
  }
}
