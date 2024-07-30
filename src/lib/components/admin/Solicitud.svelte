<script lang="ts">
	import type { Solicitud } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';

	type Props = {
		solicitud: Solicitud;
	};

	const { solicitud }: Props = $props();

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

	let stateSolicitud = $state(solicitud);

	function copyDocente() {
		navigator.clipboard.writeText(stateSolicitud.email);
	}

	console.log(stateSolicitud.estado);
</script>

<div class="grid grid-cols-9 items-center text-sm py-2 gap-2">
	<div
		class="truncate"
		use:tooltipAction={`${solicitud.fechaSalida.split('-').reverse().join('/')} - ${solicitud.fechaRegreso.split('-').reverse().join('/')}`}
	>
		FM{stateSolicitud.id}
	</div>
	<button
		class="truncate"
		use:tooltipAction={solicitud.email}
		id="div-docente"
		onclick={copyDocente}
	>
		{solicitud.docente}
	</button>
	<div class="truncate" use:tooltipAction={solicitud.departamentoFacultad}>
		{solicitud.departamentoFacultad}
	</div>
	<div class="truncate" use:tooltipAction={solicitud.asignatura}>{solicitud.asignatura}</div>
	<div class="truncate">
		<select id="comite" class="form-control" bind:value={stateSolicitud.comite}>
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
			bind:checked={stateSolicitud.agendado}
		/>
	</div>
	<div class="flex justify-center">
		<input
			id="revisado"
			class="form-check-input"
			type="checkbox"
			bind:checked={stateSolicitud.revisado}
		/>
	</div>
	<div>
		<select id="estado" class="form-control" bind:value={stateSolicitud.estado}>
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
			bind:value={stateSolicitud.acta}
		/>
	</div>
</div>
