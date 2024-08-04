<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import Section from '$src/lib/components/form/Section.svelte';

	import { showPicker } from '$src/lib/util/utils';

	const { data } = $props();

	const { sizes, config, internalData } = data;
	import { controllerDashboard } from '$src/lib/client/controllers/dashboard.svelte';

	controllerDashboard.uabs = internalData.uabs;
	controllerDashboard.config = config;

	import {
		getConsolidadoProyeccion,
		getConsolidadoByUAB,
		getConsolidadoExtras
	} from '$lib/util/consolidados';

	import { tooltipAction } from '$lib/actions/tooltip';
</script>

<Banner titulo="Modulo Vicedecanatura" variante="proyeccion">
	<a href="/admin/gestion" class="nav-link"><i class="bi bi-house"></i> Gestion</a>
</Banner>

<main class="py-12 flex flex-col w-full gap-8">
	<!-- Descargar reportes -->
	<Section titulo="Descargar reportes" icon="bi bi-bookmark">
		<div class="border rounded-md p-4 shadow-lg">
			<div class="flex justify-between items-top">
				<h4 class="card-titulo">Proyecciones</h4>

				<span
					class="cursor-pointer"
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-title="Copiar link del formulario de proyeccion"
				>
					<span class="text-muted fw-lighter decoration-orange">Copiar link</span>
					<i class="bi bi-clipboard2"></i>
				</span>
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
					onclick={getConsolidadoProyeccion}
					use:tooltipAction={'Descargar consolidado de proyecciones hasta el momento'}
				>
					<span>Descargar reporte</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<button
					class="btn-primary font-semibold"
					onclick={getConsolidadoExtras}
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
					onclick={() =>
						getConsolidadoByUAB(
							controllerDashboard.uabs.find(
								({ codigo }) => codigo === controllerDashboard.selectedUAB
							)?.codigo as string
						)}
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
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-title="Descargar consolidado de las solicitudes hasta el momento"
					id="btn-getConsolidadoSolicitud"
				>
					<span>Descargar reporte</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<button
					class="btn-primary font-semibold"
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-title="Avisar a docentes que proyectaron salidas pero no han realizado la solicitud correspondiente"
					id="btn-avisoDocentes"
				>
					<span>Avisar docentes</span>
					<i class="bi bi-send"></i>
				</button>
				<button
					id="btn-getConsolidadoFinal"
					class="btn-primary font-semibold"
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-title="Descargar consolidado de las solicitudes hasta el momento con todos los datos"
				>
					<span>Consolidado final</span>
					<i class="bi bi-download fw-bold"></i>
				</button>
				<button
					id="btn-getSolicitudesAprobadas"
					class="btn-primary font-semibold"
					data-bs-toggle="tooltip"
					data-bs-placement="top"
					data-bs-title="Descargar consolidado de las solicitudes aprobadas hasta el momento"
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
				data-bs-toggle="tooltip"
				data-bs-placement="top"
				data-bs-title="Actualizar dats"
				id="btn-update-data"
			>
				<span>Actualizar datos</span>
				<i class="bi bi-send"></i>
			</button>

			<button
				class="btn-primary font-semibold"
				data-bs-toggle="tooltip"
				data-bs-placement="top"
				data-bs-title="Actualizar dats"
				id="btn-update-users"
			>
				<span>Actualizar usuarios</span>
				<i class="bi bi-send"></i>
			</button>
		</div>
	</Section>

	<Section titulo="Buscar salida" icon="bi bi-search">
		<div class="row">
			<div class="col-12">
				<div class="input-group mb-3">
					<input
						type="text"
						class="form-control searchBar"
						placeholder="Código FM de la salida de campo"
						id="inputCode"
					/>
					<button class="btn-primary" type="button" id="btn-searchProyeccion">Buscar</button>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<div class="d-flex justify-content-between align-items-center">
							<span>Datos de la salida</span>
							<button type="button" class="btn-close btn-close-black" id="btn-clearBusqueda"
							></button>
						</div>
					</div>

					<div class="card-body" id="resultado-busqueda"></div>
				</div>
			</div>
		</div>
	</Section>
</main>

<style lang="scss">
	.card-titulo {
		color: #f9ae00;
		@apply font-semibold text-lg mb-2;
	}
</style>
