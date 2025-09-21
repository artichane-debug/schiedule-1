import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Clock, Calendar, Palette, Save, X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  theme: 'light' | 'dark' | 'system';
  timeFormat: '12' | '24';
  defaultSemester: 'fall' | 'spring' | 'summer';
  showWeekends: boolean;
  compactView: boolean;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { toast } = useToast();
  
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('schiedule-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    return {
      theme: 'system',
      timeFormat: '12',
      defaultSemester: 'fall',
      showWeekends: true,
      compactView: false,
    };
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('schiedule-settings', JSON.stringify(settings));
    
    // Apply theme changes immediately
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    toast({
      title: "Settings Saved! ⚙️",
      description: "Your preferences have been updated successfully.",
    });
    
    onClose();
  };

  const handleReset = () => {
    setSettings({
      theme: 'system',
      timeFormat: '12',
      defaultSemester: 'fall',
      showWeekends: true,
      compactView: false,
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto rounded-lg border bg-card shadow-lg">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Sun className="h-3 w-3 text-white" />
              </div>
              <Label className="text-base font-semibold">Theme Preference</Label>
            </div>
            <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}>
              <SelectTrigger className="rounded-lg border bg-background hover:bg-muted/50 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border bg-background shadow-lg">
                <SelectItem value="system" className="hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-primary rounded-full" />
                    <span>System Default</span>
                  </div>
                </SelectItem>
                <SelectItem value="light" className="hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark" className="hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Time Format */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <Clock className="h-3 w-3 text-white" />
              </div>
              <Label className="text-base font-semibold">Time Format</Label>
            </div>
            <Select value={settings.timeFormat} onValueChange={(value: '12' | '24') => updateSetting('timeFormat', value)}>
              <SelectTrigger className="rounded-lg border bg-background hover:bg-muted/50 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border bg-background shadow-lg">
                <SelectItem value="12" className="hover:bg-muted/50">12-hour format (2:30 PM)</SelectItem>
                <SelectItem value="24" className="hover:bg-muted/50">24-hour format (14:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Default Semester */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-3 w-3 text-white" />
              </div>
              <Label className="text-base font-semibold">Default Semester</Label>
            </div>
            <Select value={settings.defaultSemester} onValueChange={(value: 'fall' | 'spring' | 'summer') => updateSetting('defaultSemester', value)}>
              <SelectTrigger className="rounded-lg border bg-background hover:bg-muted/50 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border bg-background shadow-lg">
                <SelectItem value="fall" className="hover:bg-muted/50">Fall Semester</SelectItem>
                <SelectItem value="spring" className="hover:bg-muted/50">Spring Semester</SelectItem>
                <SelectItem value="summer" className="hover:bg-muted/50">Summer Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Toggle Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <Label htmlFor="show-weekends" className="text-base font-semibold">Show Weekend Classes</Label>
              </div>
              <Switch
                id="show-weekends"
                checked={settings.showWeekends}
                onCheckedChange={(checked) => updateSetting('showWeekends', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Palette className="h-3 w-3 text-white" />
                </div>
                <Label htmlFor="compact-view" className="text-base font-semibold">Compact View</Label>
              </div>
              <Switch
                id="compact-view"
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSetting('compactView', checked)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
            >
              Reset to Defaults
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
