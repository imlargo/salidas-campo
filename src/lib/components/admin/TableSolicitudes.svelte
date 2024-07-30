<script lang="ts">
	import type { Solicitud } from '$src/lib/types';

	import SolicitudRow from './Solicitud.svelte';

	type Props = {
		solicitudes: Solicitud[];
	};

	const { solicitudes }: Props = $props();
</script>

<div class="grid grid-cols-9 text-center">
	<span>FM</span>
	<span>Docente</span>
	<span>Departamento</span>
	<span>Asignatura</span>
	<span>Comité asesor</span>
	<span class="text-center">Agendar</span>
	<span class="text-center">Revisado</span>
	<span>Concepto</span>
	<span>Acta</span>
</div>

<div class="flex flex-col divide-y divide-solid mt-3 border-y">
	{#each solicitudes as solicitud}
		<SolicitudRow {solicitud} />
	{/each}
</div>
