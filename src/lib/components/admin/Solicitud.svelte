<script lang="ts">
	import type { Solicitud } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';

	type Props = {
		solicitud: Solicitud;
	};

	const { solicitud }: Props = $props();
</script>

<div class="grid grid-cols-9 items-center text-sm py-2 gap-2">
	<div
		class="truncate"
		use:tooltipAction={`${solicitud.fechaSalida.split('-').reverse().join('/')} - ${solicitud.fechaRegreso.split('-').reverse().join('/')}`}
	>
		FM{solicitud.id}
	</div>
	<div class="truncate" use:tooltipAction={solicitud.email} id="div-docente">
		{solicitud.docente}
	</div>
	<div class="truncate" use:tooltipAction={solicitud.uab}>{solicitud.uab}</div>
	<div class="truncate" use:tooltipAction={solicitud.asignatura}>{solicitud.asignatura}</div>
	<div class="truncate">
		<select id="comite" class="form-control">
			<option disabled selected value> -- Seleccionar -- </option>
		</select>
	</div>
	<div class="flex justify-center">
		<input id="agendado" class="form-check-input" type="checkbox" />
	</div>
	<div class="flex justify-center">
		<input id="revisado" class="form-check-input" type="checkbox" />
	</div>
	<div>
		<select id="estado" class="form-control">
			<option selected value="0"> -- Seleccionar -- </option>
			<option value="1">Aprobada</option>
			<option value="2">Negada</option>
			<option value="3">Pendiente</option>
		</select>
	</div>
	<div>
		<input class="form-control" type="text" id="acta" placeholder="Num acta" />
	</div>
</div>
