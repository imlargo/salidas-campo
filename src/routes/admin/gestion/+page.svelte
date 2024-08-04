<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import TableSolicitudes from '$src/lib/components/admin/TableSolicitudes.svelte';

	import { controllerGestion } from '$src/lib/client/controllers/gestion.svelte';

	const { data } = $props();

	const { solicitudes } = data;
	controllerGestion.solicitudes = solicitudes;

	let filtroCampo = $state('');
	let filtroValor = $state('');
	let filtrado = $state(false);

	function changeCampo() {
		document.getElementById('filtro-valor').value = '';
		document.getElementById('filtro-valor')?.dispatchEvent(new Event('change'));

		filtrado = false;

		if (filtroCampo === '') {
			filtroValor = '';
			return;
		}
	}

	function changeValor() {
		filtrado = false;
	}

	function filtrar() {
		if (filtroCampo === '' || filtroValor === '') {
			return;
		}

		filtrado = true;
	}

	function eliminarFiltro() {
		filtrado = false;
	}

	let listadoCampos = $derived.by(() => {
		const data = Array.from(
			new Set(
				controllerGestion.solicitudes.map((solicitud) => {
					if (filtroCampo === 'acta') {
						return solicitud[filtroCampo] || 'Sin asignar';
					}

					return solicitud[filtroCampo];
				})
			)
		);

		return data;
	});
</script>

<Banner titulo="Gestion de Solicitudes" variante="proyeccion">
	<a href="/admin/dashboard" class="nav-link"><i class="bi bi-house"></i> Dashboard</a>
</Banner>

<main class="py-12 w-full">
	<div class="flex flex-col md:flex-row justify-end gap-4">
		<button class="btn-primary">
			<i class="bi bi-table"></i>
			<span>Consolidar conceptos</span>
		</button>

		<button class="btn-primary">
			<i class="bi bi-file-earmark-text"></i>
			<span>Generar agenda</span>
		</button>

		<button class="btn-primary">
			<i class="bi bi-cloud-check"></i>
			<span>Guardar</span>
		</button>
	</div>

	<hr class="mt-5" />

	<div class="flex flex-col md:flex-row justify-between py-4">
		<div class="flex gap-4 items-center">
			<span>
				<strong>Solicitudes agendadas: </strong>
			</span>
			<span class="decoration-orange"
				>{controllerGestion.solicitudes.filter(({ agendado }) => agendado).length || '...'}</span
			>
		</div>

		<div class="flex flex-col md:flex-row items-center gap-3">
			<i id="filter-icon" class:filtro-activo={filtrado} class="bi bi-funnel"></i>

			<select
				id="filtro-campo"
				class="px-3 py-1 border rounded block w-50"
				bind:value={filtroCampo}
				onchange={changeCampo}
			>
				<option selected value=""> -- Seleccionar campo -- </option>
				<option value="docente">Docente</option>
				<option value="uab">UAB</option>
				<option value="comite">Comite</option>
				<option value="estado">Concepto</option>
				<option value="acta">Acta</option>
			</select>

			<select
				id="filtro-valor"
				class="px-3 py-1 border rounded block w-50"
				bind:value={filtroValor}
				onchange={changeValor}
			>
				<option selected value=""> -- Seleccionar valor -- </option>
				{#each listadoCampos as valor}
					{#if valor}
						<option value={valor}>{valor}</option>
					{:else}
						<option value={valor}>Sin asignar</option>
					{/if}
				{/each}
			</select>

			<button
				onclick={filtrar}
				id="filtro-btn-filtrar"
				class="font-semibold text-sm text-blue-500 border border-blue-500 rounded-md py-2 px-4 block"
				>Fitrar</button
			>
			<button
				onclick={eliminarFiltro}
				id="filtro-btn-borrar"
				class="font-semibold text-sm text-red-500 border border-red-500 rounded-md py-2 px-4 block bi bi-trash"
			></button>
		</div>
	</div>

	<hr class="mb-5" />

	<TableSolicitudes
		solicitudes={controllerGestion.solicitudes.filter(
			(solicitud) => !filtrado || solicitud[filtroCampo] === filtroValor
		)}
	/>
</main>

<style lang="scss">
	.filtro-activo {
		color: #ffc420;
	}
</style>
