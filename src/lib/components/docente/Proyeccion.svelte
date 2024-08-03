<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';

	type Props = {
		proyeccion: Proyeccion;
	};

	const { proyeccion }: Props = $props();
</script>

<div class="grid grid-cols-8 items-center proyeccion gap-x-5 py-2">
	<div class="text-center">FM{proyeccion.id}</div>
	<div use:tooltipAction={proyeccion.asignatura?.COD_ASIGNATURA as string}>{proyeccion.asignatura?.COD_ASIGNATURA}</div>
	<div class="text-nowrap truncate" use:tooltipAction={proyeccion.asignatura?.ASIGNATURA as string}>{proyeccion.asignatura?.ASIGNATURA}</div>
	<div>{proyeccion.fechaSalida}</div>
	<div>{proyeccion.duracion} días</div>
	<div>{proyeccion.destinos.map(({ municipio }) => municipio ).join(", ")}</div>
	<a href="/form/proyeccion?id={proyeccion.id}&edit">
		<span>Modificar</span>
		<i class="bi bi-pencil-square"></i>
	</a>
	<div class="flex items-center justify-center">
		<button class="px-2.5 py-1.5 rounded-lg border border-red-500 text-red-500 btn-sm bi bi-trash hover:bg-red-50 "></button>
	</div>
</div>

<style lang="scss">
.proyeccion{
	&:hover{
		background-color: #f3f4f6;
	}
}

a {
	text-decoration: underline;
	text-decoration-color: #f9ae00;
    font-weight: light;
}
</style>