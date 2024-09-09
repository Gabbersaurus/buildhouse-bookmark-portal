import { writable } from 'svelte/store';

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  favicon: string; // Base64-encoded string
}

function getBookmarksFromLocalStorage(): Bookmark[] {
  if (typeof localStorage == 'undefined') {
    return [];
  }

  const storedBookmarks = localStorage.getItem('bookmarks');
  return storedBookmarks ? JSON.parse(storedBookmarks) : [];
}

export const bookmarks = writable<Bookmark[]>(getBookmarksFromLocalStorage());

//Store bookmarks in localstorage on change
bookmarks.subscribe((value) => {
  if (typeof localStorage == 'undefined') {
    return;
  }

  localStorage.setItem('bookmarks', JSON.stringify(value));
});

export const updateBookmarks = (newBookmarks: Bookmark[]): void => {
  bookmarks.set(newBookmarks);
};