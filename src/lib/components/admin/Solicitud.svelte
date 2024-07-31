<script lang="ts">
	import type { Solicitud } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';
	import { ControllerSolicitud } from '$src/lib/client/controllers/solicitud.svelte';
	import { EstadoSolicitud } from '$src/lib/util/enums';

	type Props = {
		solicitud: Solicitud;
	};

	const { solicitud }: Props = $props();

	const controller = new ControllerSolicitud(solicitud);

	const areas = [
		'Ingeniería Mecánica',
		'Ingeniería Química e Ingeniería de Petróleos',
		'Medio Ambiente',
		'Ingeniería Eléctrica e Ingeniería de Control',
		'Ingeniería Administrativa e Ingeniería Industrial',
		'Ingeniería Civil',
		'Ingeniería de Sistemas e Informática',
		'Recursos Minerales',
		'Materiales y Nanotecnología'
	];
</script>

<div class="grid grid-cols-9 items-center text-sm py-2 gap-2">
	<div
		class="truncate"
		use:tooltipAction={`${controller.solicitud.fechaSalida.split('-').reverse().join('/')} - ${controller.solicitud.fechaRegreso.split('-').reverse().join('/')}`}
	>
		FM{controller.solicitud.id}
	</div>
	<button
		class="truncate"
		use:tooltipAction={controller.solicitud.email}
		id="div-docente"
		onclick={controller.copyDocente}
	>
		{controller.solicitud.docente}
	</button>
	<div class="truncate" use:tooltipAction={controller.solicitud.departamentoFacultad}>
		{controller.solicitud.departamentoFacultad}
	</div>
	<div class="truncate" use:tooltipAction={controller.solicitud.asignatura}>
		{controller.solicitud.asignatura}
	</div>
	<div class="truncate">
		<select
			id="comite"
			class="form-control"
			bind:value={controller.solicitud.comite}
			onchange={() => controller.changeComite()}
		>
			<option disabled selected value=""> -- Seleccionar -- </option>
			{#each areas as area}
				<option value={area}>{area}</option>
			{/each}
		</select>
	</div>
	<div class="flex justify-center">
		<input
			id="agendado"
			class="form-check-input"
			type="checkbox"
			bind:checked={controller.solicitud.agendado}
			onchange={() => controller.changeAgendado()}
			disabled={controller.solicitud.revisado}
		/>
	</div>
	<div class="flex justify-center">
		<input
			id="revisado"
			class="form-check-input"
			type="checkbox"
			bind:checked={controller.solicitud.revisado}
			onchange={() => controller.changeRevisado()}
		/>
	</div>
	<div>
		<select
			id="estado"
			class="form-control"
			class:isPendiente={controller.solicitud.estado === EstadoSolicitud.PENDIENTE}
			bind:value={controller.solicitud.estado}
			onchange={() => controller.changeEstado()}
		>
			<option selected value="0"> -- Seleccionar -- </option>
			<option value="1">Aprobada</option>
			<option value="2">Negada</option>
			<option value="3">Pendiente</option>
		</select>
	</div>
	<div>
		<input
			class="form-control"
			type="text"
			id="acta"
			placeholder="Num acta"
			bind:value={controller.solicitud.acta}
			onchange={() => controller.changeActa()}
		/>
	</div>
</div>

<style lang="scss">
	.isPendiente {
		background-color: #f8d7da;
		color: #721c24;
	}
</style>
