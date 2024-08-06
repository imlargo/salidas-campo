<script lang="ts">
	import { flip } from 'svelte/animate';
	import { toastController } from '$src/lib/stores/toastStore.svelte';

	function toastAction(toastElement: HTMLDivElement) {
		const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement);
		toastElement.addEventListener('hidden.bs.toast', () => {
			toastController.shift();
		});

		toastInstance.show();
	}
</script>

<div class="z-40 flex flex-col gap-3 fixed bottom-3 end-3 p-3">
	{#each toastController.mensajes as mensaje, index (`${index}-${mensaje}`)}
		<div
			animate:flip={{ duration: 300 }}
			use:toastAction
			class="toast bg-purple-500 text-white z-40 flex items-center toast-purple border-0 w-80 px-4 py-3 rounded"
			role="alert"
		>
			<div class="flex justify-between items-center w-full">
				<p class="toast-body">{mensaje}</p>
				<button
					type="button"
					class="bi bi-x-lg btn-close btn-close-black me-2 m-auto"
					data-bs-dismiss="toast"
				></button>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
</style>
