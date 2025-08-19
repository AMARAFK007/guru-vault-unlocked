import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { setupDatabase, testConnection } from '@/lib/setup-database'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function Setup() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Test connection first
      console.log('Testing database connection...')
      const connected = await testConnection()
      setConnectionStatus(connected)
      
      if (!connected) {
        setError('Database connection failed. Please check your Supabase configuration.')
        setIsLoading(false)
        return
      }
      
      // Setup database
      console.log('Setting up database...')
      const result = await setupDatabase()
      
      if (result.success) {
        setSetupComplete(true)
        console.log('✅ Database setup completed successfully!')
      } else {
        setError('Database setup failed: ' + (result.error?.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Setup error:', err)
      setError('Setup failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    const connected = await testConnection()
    setConnectionStatus(connected)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>LearnforLess Database Setup</CardTitle>
            <CardDescription>
              Set up your Supabase database for the LearnforLess platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <span>Database Connection:</span>
              {connectionStatus === null ? (
                <span className="text-muted-foreground">Not tested</span>
              ) : connectionStatus ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>Failed</span>
                </div>
              )}
            </div>

            {/* Setup Status */}
            <div className="flex items-center gap-2">
              <span>Database Setup:</span>
              {setupComplete ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Not started</span>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {setupComplete && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm">
                  ✅ Database setup completed! Your LearnforLess platform is ready to use.
                  <br />
                  You can now go back to the homepage and test the functionality.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleTestConnection} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              
              <Button 
                onClick={handleSetup} 
                disabled={isLoading || setupComplete}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : setupComplete ? (
                  'Setup Complete'
                ) : (
                  'Setup Database'
                )}
              </Button>
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t">
              <Button variant="link" asChild>
                <a href="/">← Back to Homepage</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
