import { writable } from 'svelte/store';

export enum SearchProvider {
  DuckDuckGo = 'DuckDuckGo',
  Google = 'Google',
  Ecosia = 'Ecosia',
  Bing = 'Bing',
}

export interface Settings {
  searchProvider: SearchProvider;
}

export const defaultSettings = {searchProvider: SearchProvider.DuckDuckGo};

function getSettingsFromLocalStorage(): Settings {
  if (typeof localStorage == 'undefined') {
    return defaultSettings;
  }

  const storedSettings = localStorage.getItem('settings');
  return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
}

export const settings = writable<Settings>(getSettingsFromLocalStorage());

//Store settings in localstorage on change
settings.subscribe((value) => {
  if (typeof localStorage == 'undefined') {
    return;
  }

  localStorage.setItem('settings', JSON.stringify(value));
});

export const updateSettings = (newSettings: Settings): void => {
  settings.set(newSettings);
};