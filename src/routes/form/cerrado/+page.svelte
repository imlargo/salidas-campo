<script lang="ts">
	import { storeData } from '$src/lib/stores/storeData.svelte';
	import { storeAuth } from '$src/lib/stores/storeAuth.svelte';
	import Banner from '$components/form/Banner.svelte';
	import type { Config } from '$lib/types';

	const { data } = $props();

	storeData.asignaturas = data.asignaturas;
	storeData.destinos = data.destinos;
	storeData.config = data.config;
	storeData.lugares = data.lugares;
	storeData.riesgos = data.riesgos;
	storeData.uabs = data.uabs;

	const formulario = data.formulario;
	const config: Config = data.config;
</script>

<svelte:head>
	<title>Formulario Cerrado - Salidas de campo</title>
</svelte:head>

<Banner titulo="Formulario Cerrado" variante={formulario as string}>
	<a href="/resumen" class="nav-link"><i class="bi bi-house"></i> Resumen</a>
</Banner>

<div class="py-12 mx-auto w-7/12">
	<h3 class="font-semibold text-2xl text-center">
		El formulario de {formulario} se encuentra cerrado
	</h3>

	<p class="text-zinc-600 mt-5 text-pretty">
		Estimado/a docente, actualmente se encuentra fuera de las fechas del proceso de proyección por
		lo que el formulario se encuentra cerrado. El formulario estará disponible a partir del dia {formulario ===
		'proyeccion'
			? config.inicioProyeccion
			: config.inicioSolicitud}.
	</p>

	<p class="my-3">
		Fechas para realizar la proyección: {formulario === 'proyeccion'
			? config.inicioProyeccion
			: config.inicioSolicitud} hasta {formulario === 'proyeccion'
			? config.finProyeccion
			: config.finSolicitud}
	</p>

	<p>
		Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos a través de:
		gestionareasfm_med@unal.edu.co
	</p>
</div>

<style lang="scss">
</style>
