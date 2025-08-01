import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Alert } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useFirebaseConnection } from '@/hooks/useFirebase';
import type { FirebaseConfig } from '@/lib/firebase';

interface FirebaseConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_CONFIG = `{
  "apiKey": "AIzaSyC-example-api-key-here",
  "authDomain": "your-project-id.firebaseapp.com",
  "databaseURL": "https://your-project-id-default-rtdb.firebaseio.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project-id.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef1234567890"
}`;

export function FirebaseConfigDialog({ open, onOpenChange }: FirebaseConfigDialogProps) {
  const { initialize, testConnection, reset, connected, configured, loading, error, clearError } = useFirebaseConnection();
  
  const [configInput, setConfigInput] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [formData, setFormData] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [useJsonInput, setUseJsonInput] = useState(true);
  const [testing, setTesting] = useState(false);

  const handleFormChange = useCallback((field: keyof FirebaseConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleJsonChange = useCallback((value: string) => {
    setConfigInput(value);
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        setFormData({
          apiKey: parsed.apiKey || '',
          authDomain: parsed.authDomain || '',
          databaseURL: parsed.databaseURL || '',
          projectId: parsed.projectId || '',
          storageBucket: parsed.storageBucket || '',
          messagingSenderId: parsed.messagingSenderId || '',
          appId: parsed.appId || '',
        });
      }
    } catch {
      // Invalid JSON, ignore
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
    
    const config = useJsonInput ? (
      (() => {
        try {
          return JSON.parse(configInput);
        } catch {
          return null;
        }
      })()
    ) : formData;

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
  }, [useJsonInput, configInput, formData, initialize, validateConfig, clearError]);

  const handleTest = useCallback(async () => {
    if (!configured) {
      setError('Firebase not configured. Please configure Firebase first.');
      return;
    }
    
    setTesting(true);
    clearError();
    const success = await testConnection();
    if (success) {
      // Clear any previous errors on successful test
      clearError();
    } else {
      setError('Connection test failed. Please check your Firebase configuration and network connection.');
    }
    setTesting(false);
  }, [configured, testConnection, clearError]);

  const handleReset = useCallback(() => {
    reset();
    setConfigInput('');
    setFormData({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    });
    clearError();
  }, [reset, clearError]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isValid = useJsonInput ? 
    (() => {
      try {
        const parsed = JSON.parse(configInput);
        return validateConfig(parsed) === null;
      } catch {
        return false;
      }
    })() : 
    validateConfig(formData) === null;

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
            <br />
            <span className="text-sm text-muted-foreground">
              Get your Firebase config from your Firebase Console → Project Settings → General → Your Apps → Web App
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          {configured && (
            <Alert className={connected ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
              <div className="flex items-center gap-2">
                {connected ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-orange-600" />
                )}
                <span className={connected ? "text-green-700 w-fit" : "text-orange-700 w-fit"}>
                  {connected ? "Connected to Firebase" : "Firebase configured but not connected"}
                </span>
              </div>
            </Alert>
          )}

          {/* Success message when connection is established */}
          {connected && configured && !error && (
            <Alert className="border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700">
                  Firebase connection successful! You can now use real-time widgets.
                </span>
              </div>
            </Alert>
          )}

          {/* Help message for first-time users */}
          {!configured && (
            <Alert className="border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">
                  To use real-time widgets, you need to configure your Firebase Realtime Database connection.
                </span>
              </div>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="w-4 h-4 text-red-600" />
              <div className="text-red-700">{error}</div>
            </Alert>
          )}

          {/* Input Method Toggle */}
          <div className="flex gap-2">
            <Button
              variant={useJsonInput ? "default" : "outline"}
              size="sm"
              onClick={() => setUseJsonInput(true)}
            >
              JSON Config
            </Button>
            <Button
              variant={!useJsonInput ? "default" : "outline"}
              size="sm"
              onClick={() => setUseJsonInput(false)}
            >
              Form Fields
            </Button>
          </div>

          {useJsonInput ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="config-json">Firebase Configuration (JSON)</Label>
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
                placeholder="Paste your Firebase config JSON here..."
                value={configInput}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              {showConfig && (
                <div className="p-3 bg-muted rounded border">
                  <Label className="text-xs text-muted-foreground">Sample Configuration:</Label>
                  <pre className="text-xs mt-1 whitespace-pre-wrap">{SAMPLE_CONFIG}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    value={formData.apiKey}
                    onChange={(e) => handleFormChange('apiKey', e.target.value)}
                    placeholder="your-api-key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID *</Label>
                  <Input
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleFormChange('projectId', e.target.value)}
                    placeholder="your-project-id"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="databaseURL">Database URL *</Label>
                <Input
                  id="databaseURL"
                  value={formData.databaseURL}
                  onChange={(e) => handleFormChange('databaseURL', e.target.value)}
                  placeholder="https://your-project-default-rtdb.firebaseio.com/"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authDomain">Auth Domain</Label>
                <Input
                  id="authDomain"
                  value={formData.authDomain}
                  onChange={(e) => handleFormChange('authDomain', e.target.value)}
                  placeholder="your-project.firebaseapp.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storageBucket">Storage Bucket</Label>
                  <Input
                    id="storageBucket"
                    value={formData.storageBucket}
                    onChange={(e) => handleFormChange('storageBucket', e.target.value)}
                    placeholder="your-project.appspot.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
                  <Input
                    id="messagingSenderId"
                    value={formData.messagingSenderId}
                    onChange={(e) => handleFormChange('messagingSenderId', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="appId">App ID</Label>
                <Input
                  id="appId"
                  value={formData.appId}
                  onChange={(e) => handleFormChange('appId', e.target.value)}
                  placeholder="1:123456789:web:abcdef123456"
                />
              </div>
            </div>
          )}
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