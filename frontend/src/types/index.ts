export type Provider = 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek';

export interface KeyEntry {
  id: string;
  name: string;
  apiKey: string;
  tags?: string[];
  folderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: string;
  isFavorite?: boolean;
}

export type Status = 'active' | 'inactive' | 'error' | 'unknown';

export interface ProviderInfo {
  name: Provider;
  displayName: string;
  docsUrl: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt?: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count?: number;
}
