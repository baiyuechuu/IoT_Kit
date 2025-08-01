import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Loader2, Database, Eye, EyeOff } from 'lucide-react';
import { useFirebaseConnection } from '@/contexts/FirebaseContext';
import type { FirebaseConfig } from '@/lib/firebase';

interface FirebaseConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_CONFIG = `{
  apiKey: "AIzaSyAja2offUYcZ8Atf-KqG6hVopb9t8PWsG0",
  authDomain: "test-dashboard-web.firebaseapp.com",
  databaseURL: "https://test-dashboard-web-default-rtdb.firebaseio.com",
  projectId: "test-dashboard-web",
  storageBucket: "test-dashboard-web.firebasestorage.app",
  messagingSenderId: "648959894707",
  appId: "1:648959894707:web:63947255f9a07c248dfcc6",
  measurementId: "G-TC8HQYN00Y"
}`;

export function FirebaseConfigDialog({ open, onOpenChange }: FirebaseConfigDialogProps) {
  const { initialize, checkRealConnection, reset, connected, configured, loading, error, clearError, setError } = useFirebaseConnection();

  const [configInput, setConfigInput] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleJsonChange = useCallback((value: string) => {
    setConfigInput(value);
  }, []);

  // Function to convert JavaScript object format to valid JSON
  const convertJsObjectToJson = useCallback((input: string): string => {
    try {
      // First try to parse as-is (in case it's already valid JSON)
      JSON.parse(input);
      return input;
    } catch {
      // If it fails, try to convert JavaScript object to JSON
      try {
        // Remove any leading/trailing whitespace and ensure it starts/ends with braces
        let cleaned = input.trim();

        // Add braces if missing
        if (!cleaned.startsWith('{')) cleaned = '{' + cleaned;
        if (!cleaned.endsWith('}')) cleaned = cleaned + '}';

        // Replace unquoted keys with quoted keys
        // This regex matches property names that aren't already quoted
        const withQuotedKeys = cleaned.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

        // Test if the conversion worked
        JSON.parse(withQuotedKeys);
        return withQuotedKeys;
      } catch {
        // If conversion fails, return original input
        return input;
      }
    }
  }, []);

  const validateConfig = useCallback((config: FirebaseConfig): string | null => {
    if (!config.databaseURL) {
      return 'Database URL is required';
    }
    if (!config.databaseURL.startsWith('https://') && !config.databaseURL.startsWith('http://')) {
      return 'Database URL must start with https:// or http://';
    }
    if (!config.projectId) {
      return 'Project ID is required';
    }
    if (!config.apiKey) {
      return 'API Key is required';
    }
    if (config.apiKey.length < 10) {
      return 'API Key appears to be invalid (too short)';
    }
    return null;
  }, []);

  const handleConnect = useCallback(async () => {
    clearError();

    // Convert JavaScript object format to JSON if needed
    const jsonString = convertJsObjectToJson(configInput);

    let config;
    try {
      config = JSON.parse(jsonString);
    } catch {
      setError('Invalid configuration format. Please check your input and try again.');
      return;
    }

    if (!config) {
      setError('Invalid configuration. Please check your input.');
      return;
    }

    const validationError = validateConfig(config);
    if (validationError) {
      setError(validationError);
      return;
    }

    await initialize(config);

    // Use the more reliable connection check after initialization
    await checkRealConnection();
  }, [configInput, initialize, validateConfig, clearError, checkRealConnection, convertJsObjectToJson, setError]);

  const handleTest = useCallback(async () => {
    if (!configured) {
      setError('Firebase not configured. Please configure Firebase first.');
      return;
    }

    setTesting(true);
    clearError();

    // Use the more reliable connection check
    await checkRealConnection();

    setTesting(false);
  }, [configured, checkRealConnection, clearError, setError]);

  const handleReset = useCallback(() => {
    reset();
    setConfigInput('');
    clearError();
  }, [reset, clearError]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isValid = (() => {
    try {
      const jsonString = convertJsObjectToJson(configInput);
      const parsed = JSON.parse(jsonString);
      return validateConfig(parsed) === null;
    } catch {
      return false;
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogClose onClick={handleClose} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Firebase Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Firebase Realtime Database connection to enable real-time data for widgets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          {configured && (
            <div className={connected ? "border-green-200 bg-green-50 rounded-md p-2" : "border-orange-200 bg-orange-50 rounded-md p-2"}>
              <span className={`${connected ? "text-green-700" : "text-orange-700"} flex-1 min-w-0 break-keep`}>
                {connected ? "Connected to Firebase" : "Firebase configured but not connected"}
              </span>
            </div>
          )}

          {/* Success message when connection is established */}
          {connected && configured && !error && (
            <div className="border-green-200 bg-green-50 rounded-md p-2">
              <span className="text-green-700 flex-1 min-w-0 break-keep">
                Firebase connection successful! You can now use real-time widgets.
              </span>
            </div>
          )}

          {/* Help message for first-time users */}
          {!configured && (
            <div className="border-blue-200 bg-blue-50 rounded-md p-2">
              <span className="text-blue-700 flex-1 min-w-0 break-keep">
                To use real-time widgets, you need to configure your Firebase Realtime Database connection. You can paste the config directly from Firebase Console.
              </span>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="border-red-200 bg-red-50 rounded-md p-2">
              <div className="text-red-700">{error}</div>
            </div>
          )}

          {/* JSON Configuration Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="config-json">Firebase Configuration</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                {showConfig ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showConfig ? "Hide" : "Show"} Sample
              </Button>
            </div>
            <Textarea
              id="config-json"
              placeholder="Paste your Firebase config here (supports both JavaScript object and JSON formats)..."
              value={configInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            {showConfig && (
              <div className="p-3 bg-muted rounded border">
                <Label className="text-xs text-muted-foreground">Sample Configuration (paste as-is from Firebase Console):</Label>
                <pre className="text-xs mt-1 whitespace-pre-wrap">{SAMPLE_CONFIG}</pre>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <div className="flex-1 flex gap-2">
            {configured && (
              <>
                <Button
                  variant="outline"
                  onClick={handleTest}
                  disabled={testing}
                >
                  {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Test Connection
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset Configuration
                </Button>
              </>
            )}
          </div>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={!isValid || loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {configured ? "Update Configuration" : "Connect to Firebase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}