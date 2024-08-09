<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import Section from '$src/lib/components/form/Section.svelte';
	import type { Proyeccion } from '$src/lib/types';

	import { toastController } from '$src/lib/stores/toastStore.svelte.js';
	import { showPicker } from '$src/lib/util/utils';
	import TablaProyecciones from '$src/lib/components/admin/TablaProyecciones.svelte';
	import { dbController } from '$db/controller';
	import { storeData } from '$src/lib/stores/storeData.svelte.js';

	const { data } = $props();

	const { sizes, config, internalData } = data;
	import { controllerDashboard } from '$src/lib/client/controllers/dashboard.svelte';

	controllerDashboard.uabs = internalData.uabs;
	controllerDashboard.config = config;
	storeData.uabs = internalData.uabs;

	import {
		getConsolidadoProyeccion,
		getConsolidadoByUAB,
		getConsolidadoExtras,
		getConsolidadoSolicitud,
		getConsolidadoSolicitudesAprobadas,
		getConsolidadoSolicitudAmpliado
	} from '$lib/util/consolidados';

	import { tooltipAction } from '$lib/actions/tooltip';

	let listadoProyecciones: Proyeccion[] = $state([]);
	async function cargarListado() {
		const proyecciones = await dbController.getProyecciones();
		listadoProyecciones = proyecciones;
	}
</script>

<Banner titulo="Modulo Vicedecanatura" variante="proyeccion">
	<a href="/admin/dashboard" class="nav-link"><i class="bi bi-house"></i> Dashboard</a>
	<a href="/admin/gestion" class="nav-link"><i class="bi bi-house"></i> Gestion</a>
</Banner>

<main class="py-12 flex flex-col w-full gap-8">
	<!-- Descargar reportes -->
	<Section titulo="Descargar reportes" icon="bi bi-bookmark">
		<div class="border rounded-md p-4 shadow-lg">
			<div class="flex justify-between items-top">
				<h4 class="card-titulo">Proyecciones</h4>

				<button
					class="cursor-pointer"
					use:tooltipAction={'Copiar link del formulario de proyeccion'}
					onclick={() => {
						toastController.addMensaje('Link copiado al portapapeles');
						navigator.clipboard.writeText('https://salidas-campo.vercel.app/form/proyeccion');
					}}
				>
					<span class="text-muted fw-lighter decoration-orange">Copiar link</span>
					<i class="bi bi-clipboard2"></i>
				</button>
			</div>

			<p>
				<strong>Total salidas registradas:</strong>
				<span class="decoration-orange">{sizes.proyeccion}</span>
			</p>

			<p class="text-zinc-600 my-3">
				Aquí podrás descargar y consultar datos acerca del formulario de proyección de salidas de
				campo
			</p>

			<div class="flex flex-col md:flex-row mt-2 gap-3">
				<button
					class="btn-primary font-semibold"
					onclick={() => {
						toastController.addMensaje('Generando consolidado de proyecciones');
						getConsolidadoProyeccion();
					}}
					use:tooltipAction={'Descargar consolidado de proyecciones hasta el momento'}
				>
					<span>Descargar reporte</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<button
					class="btn-primary font-semibold"
					onclick={() => {
						toastController.addMensaje('Generando consolidado de proyecciones extras');
						getConsolidadoExtras();
					}}
					use:tooltipAction={'Descargar consolidado de proyecciones hechas fuera de tiempo'}
				>
					<span>Descargar Extras</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<select
					class="px-3 py-1 border rounded block w-full md:max-w-fit"
					bind:value={controllerDashboard.selectedUAB}
				>
					<option selected value="">-- Seleccionar --</option>
					{#each controllerDashboard.uabs as uab}
						<option value={uab.codigo}>{uab.nombre}</option>
					{/each}
				</select>
				<button
					class="btn-primary font-semibold"
					use:tooltipAction={'Descargar consolidado de proyecciones de un departamento'}
					onclick={() => {
						if (!controllerDashboard.selectedUAB) {
							toastController.addMensaje('Selecciona un departamento');
							return;
						}
						getConsolidadoByUAB(
							controllerDashboard.uabs.find(
								({ codigo }) => codigo === controllerDashboard.selectedUAB
							)?.codigo as string
						);
					}}
				>
					<span>Descargar</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
			</div>
		</div>

		<div class="border rounded-md p-4 shadow-lg">
			<h4 class="card-titulo">Solicitudes</h4>

			<p>
				<strong>Total salidas registradas:</strong>
				<span class="decoration-orange">{sizes.solicitud}</span>
			</p>

			<p class="text-zinc-600 my-3">
				Aquí podrás descargar y consultar datos acerca del formulario de solicitudes de salidas de
				campo
			</p>

			<div class="flex flex-col sm:flex-row gap-3 mt-2">
				<button
					class="btn-primary font-semibold"
					use:tooltipAction={'Descargar consolidado de las solicitudes hasta el momento'}
					onclick={getConsolidadoSolicitud}
				>
					<span>Descargar reporte</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<button
					class="btn-primary font-semibold"
					use:tooltipAction={'Avisar a docentes que proyectaron salidas pero no han realizado la solicitud correspondiente'}
					onclick={controllerDashboard.avisarDocentes}
				>
					<span>Avisar docentes</span>
					<i class="bi bi-send"></i>
				</button>
				<button
					class="btn-primary font-semibold"
					use:tooltipAction={'Descargar consolidado de las solicitudes hasta el momento con todos los datos'}
					onclick={getConsolidadoSolicitudAmpliado}
				>
					<span>Consolidado final</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<button
					class="btn-primary font-semibold"
					use:tooltipAction={'Descargar consolidado de las solicitudes aprobadas hasta el momento'}
					onclick={getConsolidadoSolicitudesAprobadas}
				>
					<span>Solicitudes aprobadas</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
			</div>
		</div>
	</Section>

	<Section titulo="Configuración " icon="bi bi-gear">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-7">
			<div>
				<span class="form-label">Inicio de semestre</span>
				<input
					type="date"
					class="form-control"
					data-campo="inicioSemestre"
					onfocus={showPicker}
					bind:value={controllerDashboard.config.inicioSemestre}
					onchange={(e) => controllerDashboard.cambiarFechaConfig(e)}
				/>
			</div>
			<div>
				<span class="form-label">Fin de semestre</span>
				<input
					type="date"
					class="form-control"
					data-campo="finSemestre"
					onfocus={showPicker}
					bind:value={controllerDashboard.config.finSemestre}
					onchange={(e) => controllerDashboard.cambiarFechaConfig(e)}
				/>
			</div>

			<div class="col">
				<span class="form-label">Inicio de proyección</span>
				<input
					type="date"
					class="form-control"
					data-campo="inicioProyeccion"
					onfocus={showPicker}
					bind:value={controllerDashboard.config.inicioProyeccion}
					onchange={(e) => controllerDashboard.cambiarFechaConfig(e)}
				/>
			</div>
			<div class="col">
				<span class="form-label">Fin de proyección</span>
				<input
					type="date"
					class="form-control"
					data-campo="finProyeccion"
					onfocus={showPicker}
					bind:value={controllerDashboard.config.finProyeccion}
					onchange={(e) => controllerDashboard.cambiarFechaConfig(e)}
				/>
			</div>

			<div class="col">
				<span class="form-label">Inicio de solicitud</span>
				<input
					type="date"
					class="form-control"
					data-campo="inicioSolicitud"
					onfocus={showPicker}
					bind:value={controllerDashboard.config.inicioSolicitud}
					onchange={(e) => controllerDashboard.cambiarFechaConfig(e)}
				/>
			</div>
			<div class="col">
				<span class="form-label">Fin de solicitud</span>
				<input
					type="date"
					class="form-control"
					data-campo="finSolicitud"
					onfocus={showPicker}
					bind:value={controllerDashboard.config.finSolicitud}
					onchange={(e) => controllerDashboard.cambiarFechaConfig(e)}
				/>
			</div>
		</div>

		<hr />

		<div class="flex flex-col sm:flex-row gap-4">
			<button
				class="btn-primary font-semibold"
				use:tooltipAction={'Actualizar dats'}
				id="btn-update-data"
			>
				<span>Actualizar datos</span>
				<i class="bi bi-send"></i>
			</button>

			<button
				class="btn-primary font-semibold"
				use:tooltipAction={'Actualizar usuarios'}
				onclick={async () => {
					toastController.addMensaje('Actualizando usuarios...');
					await fetch('/api/update-users');
				}}
				id="btn-update-users"
			>
				<span>Actualizar usuarios</span>
				<i class="bi bi-send"></i>
			</button>
		</div>
	</Section>

	<Section titulo="Listado proyecciones" icon="bi bi-clipboard2-check">
		<div>
			<button
				class="btn-primary font-medium"
				onclick={() => {
					toastController.addMensaje('Cargando listado de proyecciones...');
					cargarListado();
				}}
			>
				<i class="bi bi-arrow-clockwise"></i>

				<span>Cargar listado</span>
			</button>
		</div>
		<div>
			<TablaProyecciones proyecciones={listadoProyecciones} />
		</div>
	</Section>
</main>

<style lang="scss">
	.card-titulo {
		color: #f9ae00;
		@apply font-semibold text-lg mb-2;
	}
</style>
