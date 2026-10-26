/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface E2EESecurityState {
  isEncryptionActive: boolean;
  algorithm: 'AES-256-GCM' | 'RSA-OAEP-4096';
  keyFingerprint: string;
  lastKeyRotation: string;
  totalEncryptedPayloads: number;
  integrityVerified: boolean;
}

export interface BiometricAuthState {
  isSupported: boolean;
  isRegistered: boolean;
  credentialId?: string;
  deviceType: 'Touch ID' | 'Face ID' | 'Fingerprint Scanner' | 'FIDO2 WebAuthn';
  lastAuthenticated?: string;
}

export interface TwoFactorState {
  isEnabled: boolean;
  secret: string;
  recoveryCodesLeft: number;
}

export interface OfflineSyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string;
  pendingTransactionsCount: number;
  offlineQueue: Array<{
    id: string;
    action: string;
    payload: any;
    queuedAt: string;
  }>;
  autoSyncEnabled: boolean;
}

export interface CloudBackupSchedule {
  lastWeeklyBackup: string;
  nextScheduledBackup: string;
  totalSnapshots: number;
  storageProvider: 'Cloud Syariah Vault' | 'Google Drive Sync' | 'Local Encrypted Vault';
  isAutoWeeklyActive: boolean;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'TRANSAKSI' | 'HARGA_KOMODITAS' | 'TAGIHAN' | 'KEAMANAN_E2EE' | 'STATUS_PESANAN';
  read: boolean;
  actionUrl?: string;
}
