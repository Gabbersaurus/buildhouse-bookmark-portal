<script lang="ts">
  import SettingsIcon from "./lib/icons/SettingsIcon.svelte";
  import SettingsModal from "./lib/SettingsModal.svelte";
  import Searchbar from "./lib/Searchbar.svelte";
  import BookmarkGrid from "./lib/BookmarkGrid.svelte";

  let showSettingsModal = false;
</script>

<header class="w-full bg-neutral shadow-lg p-6 flex flex-col items-center">
  <div class="w-full max-w-xl flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">Buildhouse Bookmark Portal</h1>
    <button
      class="btn btn-ghost btn-circle fill-current"
      on:click={() => (showSettingsModal = true)}
    >
      <SettingsIcon />
    </button>
  </div>
  <Searchbar />
</header>

<main class="container mx-auto">
  <BookmarkGrid />
</main>

{#if showSettingsModal}
  <SettingsModal close={() => (showSettingsModal = false)} />
{/if}

<style>
  main {
    padding: 2rem;
  }
</style>
