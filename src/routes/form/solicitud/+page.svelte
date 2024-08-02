<script lang="ts">
	import Banner from '$components/form/Banner.svelte';
	import Section from '$src/lib/components/form/Section.svelte';
	import SearchDestinos from '$src/lib/components/form/SearchDestinos.svelte';
	import Form from '$src/lib/components/form/Form.svelte';
	import type { Proyeccion, Solicitud, Destino, Asignatura } from '$lib/types';
	import Agenda from '$src/lib/components/form/Agenda.svelte';

	import { checkNumber, showPicker } from '$src/lib/util/utils';
	import { storeData } from '$src/lib/stores/storeData.svelte';
	import { storeAuth } from '$src/lib/stores/storeAuth.svelte';
	import { storeFiltro } from '$src/lib/client/asignaturas.svelte';
	import { validateGroups } from '$src/lib/util/validation';
	import { controllerSolicitud } from '$src/lib/client/solicitud.svelte';
	import { controllerProyeccion } from '$src/lib/client/proyeccion.svelte';
	import { redirect } from '@sveltejs/kit';
	import { calcularDuracion } from '$src/lib/util/utils';

	const { data } = $props();
	const { solicitud, proyeccion, isEdit, isBlank, isNew } = data;

	storeData.asignaturas = data.asignaturas;
	storeData.destinos = data.destinos;
	storeData.config = data.config;
	storeData.lugares = data.lugares;
	storeData.riesgos = data.riesgos;
	storeData.uabs = data.uabs;

	controllerSolicitud.isBlank = isBlank as boolean;
	controllerSolicitud.isNew = isNew as boolean;
	controllerSolicitud.isEdit = isEdit as boolean;

	if (isNew) {
		controllerSolicitud.loadFromProyeccion(proyeccion as Proyeccion);
	}

	if (isEdit) {
		controllerSolicitud.loadFromSolicitud(solicitud as Solicitud);
	}

	$effect(() => {
		if (storeAuth.email !== '') {
			controllerSolicitud.docente = storeAuth.nombre;

			// Si es una proyeccion de otra persona
			if (isNew && proyeccion?.email !== storeAuth.email) {
				// No tienes permisos para editar este registro
				redirect(307, '/');
			}

			// Si es una solicitud de otra persona
			if (isEdit && solicitud?.email !== storeAuth.email) {
				// No tienes permisos para editar este registro
				redirect(307, '/');
			}
		}

		if (storeAuth.uab !== null && isBlank) {
			// Si es nueva proyección, cargar la UAB del usuario
			controllerSolicitud.uab = storeAuth.uab.codigo;
			controllerSolicitud.changeUAB(storeAuth.uab.codigo);
		}
	});

	let duracion = $derived.by(() => {
		if (isBlank) {
			if (controllerProyeccion.fechaSalida === '' || controllerProyeccion.fechaRegreso === '') {
				return 0;
			}

			return calcularDuracion(
				new Date(controllerProyeccion.fechaSalida),
				new Date(controllerProyeccion.fechaRegreso)
			);
		}

		return calcularDuracion(
			new Date(controllerSolicitud.fechaSalida),
			new Date(controllerSolicitud.fechaRegreso)
		);
	});
</script>

<svelte:head>
	<title>Formulario de Proyeccion - Salidas de campo</title>
</svelte:head>

<Banner titulo="Formulario de solicitud de salidas de campo" variante="solicitud">
	<a href="/resumen" class="nav-link"><i class="bi bi-house"></i> Resumen</a>
</Banner>

<p class="text-lg my-8 text-zinc-600">
	La fase de solicitud es la etapa en la que los docentes solicitan y obtienen la aprobación para
	realizar salidas de campo en una asignatura. Es crucial para garantizar que las salidas de campo
	se planifiquen, ejecuten y evalúen de manera efectiva, cumpliendo con los objetivos académicos y
	de seguridad. Además, se analiza la pertinencia y factibilidad de las prácticas, ya que son
	consideradas actividades académicas, por lo que deben tener una calificación en el total de la
	asignatura.
</p>

<Form handleSubmit={() => controllerSolicitud.sendData()} {isEdit}>
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
				bind:value={controllerSolicitud.facultad}
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
				bind:value={controllerSolicitud.docente}
			/>

			<div class="form-check mt-3">
				<input
					class="form-check-input"
					type="checkbox"
					id="multi-docente"
					bind:checked={controllerSolicitud.multidocente}
				/>
				<label class="form-check-label decoration-orange" for="multi-docente">
					<span>Opcional: la salida de campo incluye más de un docente?</span>
				</label>
			</div>
		</div>

		{#if controllerSolicitud.multidocente}
			<div>
				<label class="form-label" for="input-multi-docente">Nombre del docente adicional</label>
				<input
					class="form-control"
					type="text"
					id="input-multi-docente"
					placeholder="Nombre completo del docente acompañante"
					bind:value={controllerSolicitud.docenteAdicional}
				/>
			</div>
		{/if}
	</Section>

	<Section titulo="Información Asignatura">
		<div>
			<div class="field-layout grid-cols-2">
				<div>
					<label for="uab" class="form-label">Unidad académica básica</label>
					<select
						required
						class="form-control"
						id="uab"
						name="uab"
						value={storeAuth.uab?.codigo || ''}
						onchange={(e) => controllerSolicitud.changeUAB(e.target?.value)}
						class:form-disabled={isNew || isEdit}
					>
						<option value="">--- Seleccionar ---</option>
						{#each storeData.uabs as uab}
							<option value={uab.codigo}>{uab.nombre}</option>
						{/each}
					</select>
				</div>

				<div>
					<span class="form-label">Su asignatura es de:</span>
					<select
						class="form-control"
						name="nivel"
						id="nivel"
						required
						bind:value={controllerSolicitud.nivel}
					>
						<option disabled value=""> -- Seleccionar -- </option>
						<option value="Pregrado">Pregrado</option>
						<option value="Posgrado">Posgrado</option>
					</select>
				</div>
			</div>
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
						class:form-disabled={isNew || isEdit}
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
						class:form-disabled={isNew || isEdit}
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
								bind:checked={controllerSolicitud.incluirRelacion}
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

		{#if isBlank}
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
		{/if}

		<div class="field-layout grid-cols-2">
			<div>
				<label class="form-label" for="contemplada"
					>¿La salida está contemplada en el contenido de la asignatura?</label
				>
				<select
					required
					class="form-control"
					id="contemplada"
					name="contemplada"
					bind:value={controllerSolicitud.contemplada}
				>
					<option disabled value=""> -- Seleccionar -- </option>
					<option value="true">Sí</option>
					<option value="false">No</option>
				</select>

				<div class="mt-2">
					<a
						href={`https://siamed.unal.edu.co/academia/apoyo-administrativo/ConsultaContenidos.do?action=Info&idAsignatura=${storeFiltro.asignatura?.COD_ASIGNATURA}`}
						class="fw-light decoration-orange text-black"
						target="_blank"
					>
						<span>Ver el contenido de la asignatura</span>
						<i class="bi bi-box-arrow-up-right"></i>
					</a>

					<p class="mt-2 text-justify">
						<strong>Nota: </strong>
						<span class="text-muted"
							>Estimad@ docente, si en el contenido de la asignatura no se encuentra el párrafo de
							salida de campo, debe contactarse con el Sistema de Gestión de Áreas Curriculares para
							realizar la solicitud ante el comité asesor.</span
						>
					</p>
				</div>
			</div>
			<div>
				<label class="form-label" for="porcentaje"
					>Porcentaje de la salida en la nota total de la asignatura</label
				>
				<div class="relative">
					<input
						id="porcentaje"
						required
						max="100"
						type="number"
						onkeydown={checkNumber}
						name="porcentaje"
						class="form-control"
						placeholder="Ingrese aqui el porcentaje, denotar decimales con punto"
						bind:value={controllerSolicitud.porcentaje}
					/>
					<i class="bi bi-percent absolute top-1/2 -translate-y-1/2 pointer-events-none right-9"
					></i>
				</div>
			</div>
		</div>
	</Section>

	<Section titulo="Información de la práctica">
		<div>
			<span class="form-label">Pertinencia de la práctica</span>
			<textarea
				id="pertinencia"
				required
				class="form-control"
				name="pertinencia"
				bind:value={controllerSolicitud.pertinencia}
				placeholder="Describa la pertinencia de la práctica"
			></textarea>
		</div>
		<div>
			<span class="form-label">Objetivo de la práctica</span>
			<textarea
				id="objetivo"
				required
				class="form-control"
				bind:value={controllerSolicitud.objetivo}
				name="objetivo"
				placeholder="Describa el objetivo de la práctica"
			></textarea>
		</div>
		<div>
			<span class="form-label">Alcance de la práctica</span>
			<textarea
				id="alcance"
				required
				class="form-control"
				bind:value={controllerSolicitud.alcance}
				name="alcance"
				placeholder="Describa el alcance de la práctica"
			></textarea>
		</div>
		<div>
			<span class="form-label">Descripción de la actividad</span>
			<textarea
				id="descripcion"
				required
				class="form-control"
				bind:value={controllerSolicitud.descripcion}
				name="descripcion"
				placeholder="Descripción de la actividad"
			></textarea>
		</div>

		<div>
			<span class="form-label">Número mínimo de estudiantes a participar</span>
			<input
				bind:value={controllerSolicitud.asistentes}
				id="asistentes"
				max="400"
				type="number"
				onkeydown={checkNumber}
				name="asistentes"
				class="form-control"
				placeholder="Número mínimo de estudiantes a participar"
				required
			/>
		</div>
	</Section>

	<Section titulo="Requerimientos adicionales">
		<p>
			<strong><i class="bi bi-info-circle"></i></strong>
			<span class="text-zinc-600"
				>Los requerimientos adicionales hacen referencia a cualquier necesidad que se pueda
				presentar en la ejecución de la práctica: contratación adicional de transporte en la zona,
				dotaciones, contratación de personal de apoyo, lo necesario para el desarrollo de la
				actividad académica...etc.</span
			>
		</p>

		<div>
			<span class="form-label">Requerimientos adicionales</span>
			<textarea
				id="requerimientos"
				class="form-control"
				name="requerimientos"
				placeholder="Requerimientos adicionales de la salida de campo"
				bind:value={controllerSolicitud.requerimientos}
			></textarea>
		</div>

		<div>
			<label class="form-label" for="justificacionRequerimientos"
				>Justificación de los requerimientos</label
			>
			<textarea
				id="justificacionRequerimientos"
				class="form-control"
				name="justificacionRequerimientos"
				placeholder="Justifique por qué son necesarios los requerimientos"
				bind:value={controllerSolicitud.justificacionRequerimientos}
			></textarea>
		</div>

		<div>
			<label class="form-label" for="pertinenciaRequerimientos"
				>Pertinencia de los requerimientos</label
			>
			<textarea
				id="pertinenciaRequerimientos"
				class="form-control"
				name="pertinenciaRequerimientos"
				placeholder="Por qué son pertinentes los requerimientos"
				bind:value={controllerSolicitud.pertinenciaRequerimientos}
			></textarea>
		</div>
	</Section>

	<Section titulo="Información de la salida y regreso">
		{#if isBlank}
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
		{:else}
			<div class="field-layout grid-cols-2">
				<div>
					<label for="fechaSalida" class="form-label">Fecha (Día/Mes/Año)</label>
					<input
						required
						class="form-control"
						type="date"
						id="fechaSalida"
						name="fechaSalida"
						min={storeData.config.inicioSemestre}
						onchange={() => controllerSolicitud.handleFechaChange()}
						max={storeData.config.finSemestre}
						onfocus={showPicker}
						bind:value={controllerSolicitud.fechaSalida}
					/>
				</div>

				<div>
					<label for="fechaRegreso" class="form-label">Fecha (Día/Mes/Año)</label>
					<input
						required
						class="form-control"
						type="date"
						id="fechaRegreso"
						name="fechaRegreso"
						min={controllerSolicitud.fechaSalida || storeData.config.inicioSemestre}
						max={storeData.config.finSemestre}
						onfocus={showPicker}
						bind:value={controllerSolicitud.fechaRegreso}
					/>
				</div>
			</div>
		{/if}
	</Section>

	<Section titulo="Destinos">
		<div>
			<label for="input-municipio" class="form-label">
				<span>Buscar municipios de destino</span>
				<i class="bi bi-search"></i>
			</label>

			<SearchDestinos controller={controllerSolicitud} />
		</div>
	</Section>

	{#if isBlank}
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
	{/if}

	<Section titulo="Agenda de actividades">
		<Agenda {duracion} agenda={controllerSolicitud.agenda} />
	</Section>
</Form>

<style lang="scss">
	.field-layout {
		@apply grid gap-4;
	}
</style>
