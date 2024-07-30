<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import Section from '$src/lib/components/form/Section.svelte';
	import TableSolicitudes from '$src/lib/components/admin/TableSolicitudes.svelte';

	import { showPicker } from '$src/lib/util/utils';

	const { data } = $props();

	const { config, internalData, solicitudes } = data;
</script>

<Banner titulo="Gestion de Solicitudes" variante="proyeccion">
	<a href="/admin/dashboard" class="nav-link"><i class="bi bi-house"></i> Dashboard</a>
</Banner>

<main class="py-12 w-full">
	<div class="flex justify-end gap-4">
		<button class="btn-primary">
			<i class="bi bi-table"></i>
			<span>Consolidar conceptos</span>
		</button>

		<div class="vr"></div>

		<button class="btn-primary">
			<i class="bi bi-file-earmark-text"></i>
			<span>Generar agenda</span>
		</button>

		<div class="vr"></div>

		<button class="btn-primary">
			<i class="bi bi-cloud-check"></i>
			<span>Guardar</span>
		</button>
	</div>

	<hr class="mt-5" />

	<div class="flex justify-between py-4">
		<div class="flex gap-4 items-center">
			<span>
				<strong>Solicitudes agendadas: </strong>
				<span id="counter-agendadas" class="decoration-orange">...</span>
			</span>
		</div>

		<div class="flex items-center gap-3">
			<i id="filter-icon" class="bi bi-funnel"></i>

			<select id="filtro-campo" class="px-3 py-1 border rounded block w-50">
				<option selected value=""> -- Seleccionar campo -- </option>
				<option value="docente">Docente</option>
				<option value="uab">UAB</option>
				<option value="comite">Comite</option>
				<option value="estado">Concepto</option>
				<option value="acta">Acta</option>
			</select>

			<select id="filtro-valor" class="px-3 py-1 border rounded block w-50">
				<option selected value=""> -- Seleccionar valor -- </option>
			</select>

			<button
				id="filtro-btn-filtrar"
				class="font-semibold text-sm text-blue-500 border border-blue-500 rounded-md py-2 px-4 block"
				>Fitrar</button
			>
			<button
				id="filtro-btn-borrar"
				class="font-semibold text-sm text-red-500 border border-red-500 rounded-md py-2 px-4 block bi bi-trash"
			></button>
		</div>
	</div>

	<hr class="mb-5" />

	<TableSolicitudes {solicitudes} />
</main>

<style lang="scss">
</style>
