<script lang="ts">
	type Props = {
		titulo: string;
		isConfirmacion: boolean;
		callback?: () => void;
	};

	const { titulo, isConfirmacion, callback }: Props = $props();

	let modalInstance: any;

	export function close() {
		modalInstance.hide();
	}

	export function open() {
		modalInstance.show();
	}

	function handleConfirmacion() {
		close();
		if (callback) {
			callback();
		}
	}

	function modalAction(element: HTMLDivElement) {
		modalInstance = new bootstrap.Modal(element);

		if (!isConfirmacion && callback) {
			element.addEventListener('hidden.bs.modal', () => {
				callback();
			});
		}
	}
</script>

<div use:modalAction class="modal fade" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered px-5">
		<div class="modal-content">
			<div class="modal-header orange">
				<h5 class="text-xl">{titulo}</h5>
				<button type="button" class="bi bi-x-lg" data-bs-dismiss="modal" aria-label="Close"
				></button>
			</div>
			<div class="modal-body" id="modal-body">
				<slot />

				{#if isConfirmacion}
					<hr class="opacity-50 mt-3 mb-4" />
					<div class="flex justify-end gap-3">
						<button data-bs-dismiss="modal" class="rounded px-3 py-1.5 bg-zinc-200 font-semibold"
							>Cancelar</button
						>
						<button
							onclick={handleConfirmacion}
							class="rounded px-3 py-1.5 orange text-white font-semibold">Confirmar</button
						>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 20;
		display: none;
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		outline: 0;
		transition: opacity 0.15s linear;

		.modal-dialog {
			position: relative;
			width: auto;
			pointer-events: none;

			max-width: 32rem;
			@apply mx-auto rounded-lg;
		}

		.modal-dialog-centered {
			display: flex;
			align-items: center;
			min-height: calc(100% - 1.75rem * 2);
		}

		.modal-content {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 100%;
			pointer-events: auto;
			background-color: #fff;
			background-clip: padding-box;
			@apply rounded-lg;

			outline: 0;
		}

		.modal-header {
			flex-shrink: 0;
			@apply px-4 py-4 rounded-t-lg flex justify-between items-center;
		}

		.modal-body {
			position: relative;
			flex: 1 1 auto;
			@apply p-4;
		}
	}

	.orange {
		background-color: #ffa02c;
	}
</style>
