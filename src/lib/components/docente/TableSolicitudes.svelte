<script lang="ts">
	import type { Proyeccion, Solicitud } from '$src/lib/types';
	import RowSolicitud from './Solicitud.svelte';

	type Props = {
		proyecciones: Proyeccion[];
		solicitudes: Solicitud[];
	};

	const { proyecciones, solicitudes }: Props = $props();

	class StoreSolicitudes {
		proyecciones: Proyeccion[] = $state(proyecciones);
		solicitudes: Solicitud[] = $state(solicitudes);
		listado: [Proyeccion, Solicitud | null][] = $derived.by(() => {
			return proyecciones.map((proyeccion) => {
				if (!proyeccion.solicitada) {
					return [proyeccion, null];
				}

				const solicitud = solicitudes.find((solicitud) => solicitud.id === proyeccion.id) || null;
				return [proyeccion, solicitud];
			});
		});

		delete(id: number) {
			this.proyecciones = this.proyecciones.filter((p) => p.id !== id);
		}
	}

	const storeSolicitudes = new StoreSolicitudes();
</script>

<div class="grid grid-cols-8 font-semibold gap-x-5">
	<span class="text-center">Consecutivo</span>
	<span>Codigo(s)</span>
	<span>Asignatura(s)</span>
	<span>Fecha salida</span>
	<span>Fecha regreso</span>
	<span>Destinos</span>
	<span>Solicitud</span>
	<span class="text-center">Eliminar</span>
</div>

<div class="flex flex-col divide-y divide-solid mt-3 border-y">
	{#each storeSolicitudes.listado as [proyeccion, solicitud]}
		<RowSolicitud {solicitud} {proyeccion} {storeSolicitudes} />
	{/each}
</div>
