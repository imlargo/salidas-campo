<script lang="ts">
	import { NivelRiesgo } from '$src/lib/util/enums';
	import type { Riesgo } from '$lib/types';
	type Props = {
		riesgo: Riesgo;
	};
	const { riesgo }: Props = $props();

	let selected = $state(false);
	let nivel: NivelRiesgo = $state('');

	let uidRiesgo = `riesgo-${riesgo.RIESGO.toLowerCase().replace(' ', '-')}`;
</script>

<div class="flex items-center gap-2">
	<input id={uidRiesgo} type="checkbox" bind:checked={selected} />

	<label for={uidRiesgo}>{riesgo.RIESGO}</label>

	{#if selected}
		<select
			class="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-sm font-medium text-zinc-700 ring-1 ring-inset ring-zinc-700/10 riesgo-{nivel}"
			bind:value={nivel}
		>
			<option value="" disabled>-- Tipo --</option>
			<option value="Posible">Posible</option>
			<option value="Probable">Probable</option>
			<option value="Inminente">Inminente</option>
		</select>
	{/if}
</div>

<style lang="scss">
	.riesgo-Posible {
		color: #3cbd00;
		border: 1px #3cbd00 solid;
		background-color: #f2ffcc;
	}

	.riesgo-Probable {
		color: #f9b300;
		border: 1px #ffb800 solid;
		background-color: #fff0c8;
	}

	.riesgo-Inminente {
		color: #ff2164;
		border: 1px #ff5287 solid;
		background-color: #ffd5e1;
	}
</style>
