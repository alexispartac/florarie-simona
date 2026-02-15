// Store settings types for managing store status

export interface StoreSettings {
  settingsId: string;           // Unique identifier
  isOpen: boolean;              // Store open/closed status
  closureReason?: string;       // Optional reason for closure
  closureMessage?: string;      // Optional custom message to display
  scheduledOpenTime?: Date;     // Optional scheduled time to reopen
  updatedAt: Date;
  updatedBy?: string;           // Admin who made the change
}

export interface UpdateStoreSettingsRequest {
  isOpen: boolean;
  closureReason?: string;
  closureMessage?: string;
  scheduledOpenTime?: string;   // ISO string format
}
