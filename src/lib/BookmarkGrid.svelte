<script lang="ts">
    import { bookmarks } from "../stores/bookmarks";
</script>

<div
    class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8 lg:gap-16 xl:gap-24"
>
    {#each $bookmarks as bookmark}
        <a
            class="btn block h-full px-0 rounded-lg bg-neutral shadow-lg"
            href={bookmark.url}
            target="_blank"
        >
            <figure class="rounded-lg mx-2 mt-2">
                <img
                    src={bookmark.favicon || "/logo.svg"}
                    alt="{bookmark.title} favicon"
                    class="w-full aspect-square object-cover rounded-lg"
                />
            </figure>
            <div class="card-body p-2">
                <h2 class="text-sm md:text-lg text-bold text-center truncate">
                    {bookmark.title}
                </h2>
            </div>
        </a>
    {/each}
</div>
