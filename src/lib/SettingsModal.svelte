<script lang="ts">
    import { bookmarks, updateBookmarks } from "../stores/bookmarks";
    import type { Bookmark } from "../stores/bookmarks";
    import {
        settings,
        updateSettings,
        defaultSettings,
    } from "../stores/settings";
    import { SearchProvider } from "../stores/settings";
    import UpIcon from "./icons/UpIcon.svelte";
    import DownIcon from "./icons/UpIcon copy.svelte";
    import EditIcon from "./icons/EditIcon.svelte";
    import DeleteIcon from "./icons/TrashIcon.svelte";

    const searchProviders = Object.values(SearchProvider);

    let newBookmark: Bookmark = { id: 0, title: "", url: "", favicon: "" };
    let editingBookmarkId: number | null = null;
    let showResetConfirmModal = false;

    export let close: () => void;

    const saveBookmark = () => {
        if (newBookmark.title && newBookmark.url) {
            if (editingBookmarkId !== null) {
                // Update existing bookmark
                updateBookmarks(
                    $bookmarks.map((b) =>
                        b.id === editingBookmarkId
                            ? { ...newBookmark, id: editingBookmarkId }
                            : b,
                    ),
                );
                editingBookmarkId = null;
            } else {
                // Add new bookmark
                updateBookmarks([
                    ...$bookmarks,
                    { ...newBookmark, id: Date.now() },
                ]);
            }

            // Reset form
            newBookmark = { id: 0, title: "", url: "", favicon: "" };
        }
    };

    const editBookmark = (bookmark: Bookmark) => {
        newBookmark = { ...bookmark };
        editingBookmarkId = bookmark.id;
    };

    const removeBookmark = (id: number) => {
        updateBookmarks($bookmarks.filter((b) => b.id !== id));
    };

    const moveUp = (index: number) => {
        if (index < 1) {
            return;
        }

        const updatedBookmarks = [...$bookmarks];
        const temp = updatedBookmarks[index];
        updatedBookmarks[index] = updatedBookmarks[index - 1];
        updatedBookmarks[index - 1] = temp;
        updateBookmarks(updatedBookmarks);
    };

    const moveDown = (index: number) => {
        if (index >= $bookmarks.length) {
            return;
        }

        const updatedBookmarks = [...$bookmarks];
        const temp = updatedBookmarks[index];
        updatedBookmarks[index] = updatedBookmarks[index + 1];
        updatedBookmarks[index + 1] = temp;
        updateBookmarks(updatedBookmarks);
    };

    const handleSearchProviderChange = (event: Event) => {
        const selectedProvider = (event.target as HTMLSelectElement)
            .value as SearchProvider;

        updateSettings({ ...settings, searchProvider: selectedProvider });
    };

    const exportData = () => {
        const dataToExport = {
            bookmarks: $bookmarks,
            searchProvider: $settings.searchProvider,
        };

        const jsonData = JSON.stringify(dataToExport);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "bbp_settings.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const jsonData = JSON.parse(reader.result as string);
                    updateBookmarks(jsonData.bookmarks || []);
                    updateSettings({
                        searchProvider:
                            jsonData.searchProvider || $settings.searchProvider,
                    });
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error("Error reading file:", error);
        }
    };

    const importFavicon = async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                newBookmark.favicon = reader.result as string;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error reading the image file", error);
        }
    };

    const resetSettings = () => {
        updateBookmarks([]);
        updateSettings(defaultSettings);
    };
</script>

<div class="modal modal-open">
    <div class="modal-box max-w-5xl max-h-xs overflow-y-auto">
        <h3 class="font-bold text-lg">Settings</h3>

        <div class="divider" />

        <label class="form-control">
            <div class="label">
                <span class="label-text">Search Provider</span>
            </div>
            <select
                bind:value={$settings.searchProvider}
                on:change={handleSearchProviderChange}
                class="select select-bordered"
            >
                {#each searchProviders as provider}
                    <option value={provider}>{provider}</option>
                {/each}
            </select>
        </label>

        <div class="divider" />

        <h2 class="font-bold text-m">Manage bookmarks</h2>
        <div class="flex flex-col space-y-2 my-4">
            <input
                id="input_title"
                type="text"
                bind:value={newBookmark.title}
                placeholder="Title"
                class="input input-bordered w-full"
            />
            <input
                id="input_url"
                type="url"
                bind:value={newBookmark.url}
                placeholder="URL"
                class="input input-bordered w-full"
            />
            <div class="flex space-x-2">
                <input
                    id="input_favicon"
                    type="text"
                    bind:value={newBookmark.favicon}
                    placeholder="Base64 favicon"
                    class="input input-bordered w-full"
                />
                <label class="btn btn-secondary btn-outline">
                    Load image
                    <input
                        id="input_favicon_image"
                        type="file"
                        accept="image/*"
                        on:change={importFavicon}
                        class="hidden"
                    />
                </label>
            </div>

            <button on:click={saveBookmark} class="btn btn-primary">
                {editingBookmarkId !== null ? "Update" : "Add"} Bookmark
            </button>
        </div>

        <ul
            class="list-none bg-neutral p-2 space-y-4 overflow-y-scroll h-full max-h-80"
        >
            {#each $bookmarks as bookmark, index}
                <li class="flex justify-start p-4 bg-base-200 rounded shadow">
                    <img
                        src={bookmark.favicon || "/favicon.svg"}
                        alt={bookmark.title}
                        class="w-8 h-8 mr-2"
                    />
                    <div class="truncate mr-auto">{bookmark.title}</div>
                    <div class="flex space-x-2">
                        <button
                            on:click={() => moveUp(index)}
                            class="btn btn-sm btn-outline p-1"
                            disabled={index === 0}
                        >
                            <UpIcon />
                        </button>

                        <button
                            on:click={() => moveDown(index)}
                            class="btn btn-sm btn-outline p-1"
                            disabled={index === $bookmarks.length - 1}
                        >
                            <DownIcon />
                        </button>

                        <button
                            on:click={() => editBookmark(bookmark)}
                            class="btn btn-sm btn-secondary p-1"
                        >
                            <EditIcon />
                        </button>

                        <button
                            on:click={() => removeBookmark(bookmark.id)}
                            class="btn btn-sm btn-error p-1"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </li>
            {/each}
        </ul>

        <div class="divider" />

        <div
            class="modal-action flex-col space-y-2 space-x-0 md:space-y-0 md:space-x-2 md:flex-row"
        >
            <button on:click={exportData} class="btn btn-secondary btn-outline">
                Export JSON
            </button>
            <label class="btn btn-secondary btn-outline">
                Import JSON
                <input
                    type="file"
                    accept=".json"
                    on:change={importData}
                    class="hidden"
                />
            </label>
            <button
                on:click={() => {
                    showResetConfirmModal = true;
                }}
                class="btn btn-error btn-outline"
            >
                Reset settings
            </button>
            <button on:click={close} class="btn btn-primary">Close</button>
        </div>
    </div>
</div>

{#if showResetConfirmModal}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Reset?</h3>
            <p class="py-4">Are you sure you want to reset all settings?</p>
            <div class="modal-action">
                <button
                    on:click={() => {
                        resetSettings();
                        showResetConfirmModal = false;
                    }}
                    class="btn btn-error">Yes</button
                >
                <button
                    on:click={() => {
                        showResetConfirmModal = false;
                    }}
                    class="btn btn-primary">No</button
                >
            </div>
        </div>
    </div>
{/if}
