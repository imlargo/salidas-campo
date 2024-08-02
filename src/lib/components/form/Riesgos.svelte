<script lang="ts">
	import '$styles/form.scss';
	import { storeData } from '$src/lib/stores/storeData.svelte';
	import Riesgo from './Riesgo.svelte';

	const colleccionRiesgos = Object.entries(storeData.riesgos);
</script>

<div class="flex flex-col gap-5">
	{#each colleccionRiesgos as [tipo, riesgos]}
		<div>
			<span class="form-label">{tipo}</span>
			<div class="grid grid-cols-2 gap-x-4 gap-y-3">
				{#each riesgos as riesgo}
					<Riesgo {riesgo} />
				{/each}
			</div>
		</div>
	{/each}
</div>
