<script lang="ts">
	import Banner from '$components/form/Banner.svelte';
	import Section from '$src/lib/components/form/Section.svelte';
	import SearchDestinos from '$src/lib/components/form/SearchDestinos.svelte';
	import Form from '$src/lib/components/form/Form.svelte';

	import { checkNumber, showPicker } from '$src/lib/util/utils';
	import { storeData } from '$src/lib/stores/storeData.svelte';
	import { storeAuth } from '$src/lib/stores/storeAuth.svelte';
	import { storeFiltro } from '$src/lib/client/asignaturas.svelte';
	import { validateGroups } from '$src/lib/util/validation';
	import { controllerProyeccion } from '$src/lib/client/proyeccion.svelte';
	import { redirect } from '@sveltejs/kit';

	const { data } = $props();

	storeData.asignaturas = data.asignaturas;
	storeData.destinos = data.destinos;
	storeData.config = data.config;
	storeData.lugares = data.lugares;
	storeData.riesgos = data.riesgos;
	storeData.uabs = data.uabs;

	$effect(() => {
		if (storeAuth.uab !== null) {
			// Si es en blanco seleccionar UAB
			if (data.proyeccion === null) {
				controllerProyeccion.uab = storeAuth.uab.codigo;
				controllerProyeccion.changeUAB(storeAuth.uab.codigo);
				return;
			}

			// Si es editada verificar que sea del mismo usuario
			if (data.proyeccion.email !== storeAuth.email) {
				redirect(307, '/');
			}
		}
	});

	if (data.proyeccion !== null) {
		controllerProyeccion.loadFromData(data.proyeccion);
	}
</script>

<svelte:head>
	<title>Formulario de Proyeccion - Salidas de campo</title>
</svelte:head>

<Banner titulo="Formulario de proyección de salidas de campo" variante="proyeccion">
	<a href="/resumen" class="nav-link"><i class="bi bi-house"></i> Resumen</a>
</Banner>

<p class="text-lg my-8 text-zinc-600">
	Estimado docente, la fase de proyección consiste en la planificación y organización de las salidas
	de campo que se realizarán en el próximo semestre. Su participación es fundamental para estimar
	los costos de su salida de campo y solicitar los recursos financieros necesarios para su
	ejecución.
</p>

<Form handleSubmit={() => controllerProyeccion.sendData()} isEdit={data.proyeccion !== null}>
	<Section titulo="Información General">
		<div>
			<label for="facultad" class="form-label">Facultad</label>
			<input
				type="text"
				name="facultad"
				id="facultad"
				readonly
				required
				class="form-control input-disabled"
				bind:value={controllerProyeccion.facultad}
			/>
		</div>

		<div>
			<label for="docente" class="form-label">Nombre del docente responsable</label>
			<input
				required
				class="form-control input-disabled"
				type="text"
				id="docente"
				name="docente"
				readonly
				bind:value={controllerProyeccion.docente}
			/>

			<div class="form-check mt-3">
				<input
					class="form-check-input"
					type="checkbox"
					id="multi-docente"
					bind:checked={controllerProyeccion.multidocente}
				/>
				<label class="form-check-label decoration-orange" for="multi-docente">
					<span>Opcional: la salida de campo incluye más de un docente?</span>
				</label>
			</div>
		</div>

		{#if controllerProyeccion.multidocente}
			<div>
				<label class="form-label" for="input-multi-docente">Nombre del docente adicional</label>
				<input
					class="form-control"
					type="text"
					id="input-multi-docente"
					placeholder="Nombre completo del docente acompañante"
					bind:value={controllerProyeccion.docenteAdicional}
				/>
			</div>
		{/if}
	</Section>

	<Section titulo="Información Asignatura">
		<div>
			<label for="uab" class="form-label">Unidad académica básica</label>
			<select
				required
				class="form-control"
				id="uab"
				name="uab"
				value={storeAuth.uab?.codigo || ''}
				onchange={(e) => controllerProyeccion.changeUAB(e.target?.value)}
			>
				<option value="">--- Seleccionar ---</option>
				{#each storeData.uabs as uab}
					<option value={uab.codigo}>{uab.nombre}</option>
				{/each}
			</select>
		</div>

		<div>
			<div class="field-layout grid-cols-2">
				<div>
					<label for="asignatura" class="form-label">Nombre de la asignatura</label>
					<select
						required
						class="form-control"
						id="asignatura"
						name="asignatura"
						bind:value={storeFiltro.valueAsignatura}
					>
						<option value="">--- Seleccionar ---</option>

						{#each storeFiltro.listadoAsignaturas as asignatura}
							<option value={asignatura.ASIGNATURA}>{asignatura.ASIGNATURA}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="codigo" class="form-label">Código asignatura</label>
					<select
						required
						class="form-control"
						id="codigo"
						name="codigo"
						bind:value={storeFiltro.valueCodigo}
					>
						<option value="">--- Seleccionar ---</option>

						{#each storeFiltro.listadoCodigos as codigo}
							<option value={codigo}>{codigo}</option>
						{/each}
					</select>
				</div>
			</div>

			{#if storeFiltro.tieneRelacion}
				<div class="field-layout grid-cols-2 mt-3" id="contenedor-multi-asignatura">
					<div>
						<p class="decoration-orange fw-light">
							<i class="bi bi-arrow-up"></i>
							<span id="msg-multi-asignatura"
								>Esta asignatura tiene una relación con {storeFiltro.anterior?.COD_ASIGNATURA} - {storeFiltro
									.anterior?.ASIGNATURA}, ¿desea incluir esta también en la salida de campo?</span
							>
						</p>
					</div>
					<div>
						<div class="form-check">
							<input
								bind:checked={controllerProyeccion.incluirRelacion}
								class="form-check-input"
								type="checkbox"
								id="multi-asignatura"
							/>
							<label
								class="form-check-label decoration-orange"
								for="multi-asignatura"
								id="label-multi-asignatura"
								>Incluir también {storeFiltro.anterior && storeFiltro.anterior.COD_ASIGNATURA} - {storeFiltro.anterior &&
									storeFiltro.anterior.ASIGNATURA}
							</label>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<hr />

		<div class="field-layout grid-cols-2">
			<div>
				<label for="grupo" class="form-label">Número del grupo(s)</label>
				<input
					id="grupo"
					onkeydown={checkNumber}
					name="grupo"
					class="form-control"
					placeholder="Grupo(s) de la asignatura que van a ir"
					max="50"
					required
					type="text"
					bind:value={controllerProyeccion.grupo}
					onchange={validateGroups}
				/>

				<p class="mt-2 fw-light">
					<i class="bi bi-arrow-up"></i>
					<span
						>Ingrese el número del grupo. En caso de que la salida de campo incluya <span
							class="decoration-orange">más de un grupo</span
						></span
					>, ingréselos separados por coma de esta manera:
					<span class="decoration-orange">1,3,7</span>
				</p>
			</div>
			<div>
				<label for="asistentes" class="form-label">Cantidad de asistentes</label>
				<input
					required
					type="number"
					onkeydown={checkNumber}
					name="asistentes"
					id="asistentes"
					class="form-control"
					placeholder="Cantidad de asistentes"
					max="200"
					bind:value={controllerProyeccion.asistentes}
				/>
			</div>
		</div>
	</Section>
	<Section titulo="Información de la salida y regreso">
		<div class="field-layout grid-cols-3">
			<div>
				<label for="fechaSalida" class="form-label">Fecha (Día/Mes/Año)</label>
				<input
					required
					class="form-control"
					type="date"
					id="fechaSalida"
					name="fechaSalida"
					min={storeData.config.inicioSemestre}
					onchange={() => controllerProyeccion.handleFechaChange()}
					max={storeData.config.finSemestre}
					onfocus={showPicker}
					bind:value={controllerProyeccion.fechaSalida}
				/>
			</div>
			<div>
				<label for="horaSalida" class="form-label">Hora</label>
				<input
					required
					class="form-control"
					type="time"
					name="horaSalida"
					id="horaSalida"
					onfocus={showPicker}
					bind:value={controllerProyeccion.horaSalida}
				/>
			</div>
			<div>
				<label for="lugarSalida" class="form-label">Lugar de salida</label>
				<select
					required
					class="form-control"
					id="lugarSalida"
					name="lugarSalida"
					bind:value={controllerProyeccion.lugarSalida}
				>
					<option value="" disabled>--- Seleccionar ---</option>
					{#each storeData.lugares as l}
						<option value={l}>{l}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="field-layout grid-cols-3">
			<div>
				<label for="fechaRegreso" class="form-label">Fecha (Día/Mes/Año)</label>
				<input
					required
					class="form-control"
					type="date"
					id="fechaRegreso"
					name="fechaRegreso"
					min={controllerProyeccion.fechaSalida || storeData.config.inicioSemestre}
					max={storeData.config.finSemestre}
					onfocus={showPicker}
					bind:value={controllerProyeccion.fechaRegreso}
				/>
			</div>
			<div>
				<label for="horaRegreso" class="form-label">Hora</label>
				<input
					required
					class="form-control"
					type="time"
					id="horaRegreso"
					name="horaRegreso"
					onfocus={showPicker}
					bind:value={controllerProyeccion.horaRegreso}
				/>
			</div>
			<div>
				<label for="lugarRegreso" class="form-label">Lugar de llegada</label>
				<select
					required
					class="form-control"
					id="lugarRegreso"
					name="lugarRegreso"
					bind:value={controllerProyeccion.lugarRegreso}
				>
					<option value="" disabled>--- Seleccionar ---</option>
					{#each storeData.lugares as l}
						<option value={l}>{l}</option>
					{/each}
				</select>
			</div>
		</div>

		<hr />

		<div>
			<label for="duracion" class="form-label">Duracion (Cantidad de días)</label>
			<input
				required
				readonly
				type="number"
				onkeydown={checkNumber}
				id="duracion"
				name="duracion"
				class="form-control input-disabled"
				placeholder="Duración de la salida"
				value={controllerProyeccion.duracion}
			/>
		</div>
	</Section>

	<Section titulo="Destinos">
		<div>
			<label for="input-municipio" class="form-label">
				<span>Buscar municipios de destino</span>
				<i class="bi bi-search"></i>
			</label>

			<SearchDestinos controller={controllerProyeccion} />
		</div>
	</Section>
	<Section titulo="Destino más lejano">
		<div>
			<label for="municipio" class="form-label">Municipio</label>
			<select
				required
				class="form-control"
				id="ultimoDestino"
				name="ultimoDestino"
				bind:value={controllerProyeccion.ultimoDestinoSelection}
			>
				<option value="" disabled>--- Seleccionar ---</option>
				{#each controllerProyeccion.destinos as destino}
					<option value={destino.municipio}>{destino.municipio}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="observaciones" class="form-label">Observaciones</label>
			<p class="mb-2">
				Ingrese aqui sus observacioes adicionales, ya sea con respecto a el lugar de destino.
			</p>
			<textarea
				name="observaciones"
				id="observaciones"
				class="form-control"
				bind:value={controllerProyeccion.observaciones}
			></textarea>
		</div>
	</Section>
</Form>

<style lang="scss">
	.field-layout {
		@apply grid gap-4;
	}
</style>
