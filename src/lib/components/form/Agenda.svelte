<script lang="ts">
	const {
		duracion,
		agenda
	}: {
		duracion: number;
		agenda: string[];
	} = $props();
	import '$styles/form.scss';

	let dias = $derived.by(() => {
		return Array.from({ length: duracion }, (_, i) => i);
	});

	$effect(() => {
		if (agenda.length < duracion) {
			for (let i = agenda.length; i < duracion; i++) {
				agenda[i] = '';
			}
		}

		const size = agenda.length;

		if (size > duracion) {
			for (let i = 0; i < size - duracion; i++) {
				agenda.pop();
			}
		}
	});
</script>

{#if duracion === 0}
	<p>Selecciona las fechas de salida y llegada...</p>
{:else}
	{#each dias as dia (dia)}
		<div>
			<label class="form-label" for="">Día #{dia + 1}</label>
			<textarea bind:value={agenda[dia]} class="form-control" data-dia={dia} required></textarea>
		</div>
	{/each}
{/if}
