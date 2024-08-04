<script lang="ts">
	import '$styles/form.scss';
	import type { SeleccionRiesgo, Riesgo } from '$lib/types';
	import { controllerRiesgos } from '$src/lib/client/controllers/riesgos.svelte';
	import { storeData } from '$src/lib/stores/storeData.svelte';

	import RiesgoRow from './Riesgo.svelte';

	const {
		solicitudRiesgos
	}: {
		solicitudRiesgos: SeleccionRiesgo[] | null;
	} = $props();

	let listado: [string, Riesgo[]][] = Object.entries(storeData.riesgos);
	controllerRiesgos.initListado(listado);

	if (solicitudRiesgos && solicitudRiesgos.length > 0) {
		controllerRiesgos.cargarRiesgos(solicitudRiesgos);
	}
</script>

<div class="flex flex-col gap-5">
	{#each listado as [tipo, riesgos]}
		<div>
			<span class="form-label">{tipo}</span>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
				{#each riesgos as riesgo}
					<RiesgoRow
						riesgo={controllerRiesgos.getRiesgo(controllerRiesgos.getUid(riesgo.RIESGO))}
					/>
				{/each}
			</div>
		</div>
	{/each}
</div>
