<script lang="ts">
    import { settings, SearchProvider } from "../stores/settings";

    let searchQuery = "";
    $: searchQueryUrl =
        getSearchProviderQueryURL($settings.searchProvider as SearchProvider) +
        searchQuery;

    const getSearchProviderQueryURL = (searchProvider: SearchProvider) => {
        switch (searchProvider) {
            case SearchProvider.Google:
                return "https://www.google.com/search?&q=";
            case SearchProvider.Ecosia:
                return "https://www.ecosia.org/search?q=";
            case SearchProvider.Bing:
                return "https://www.bing.com/search?q=";
            default:
                return "https://duckduckgo.com/?q=";
        }
    };
</script>

<div class="w-full max-w-xl flex space-x-2">
    <input
        type="text"
        placeholder="Search the internet..."
        bind:value={searchQuery}
        class="input input-bordered w-full"
    />
    <a href={searchQueryUrl} target="_blank" class="btn btn-primary">Search</a>
</div>
