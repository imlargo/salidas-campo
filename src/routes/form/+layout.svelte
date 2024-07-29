<script lang="ts">
	import { page } from '$app/stores';

	import '$styles/form.scss';
	import Banner from '$components/form/Banner.svelte';
	import Footer from '$components/layout/Footer.svelte';
</script>

<div class="max-w-7xl mx-auto container py-5">
	<Banner variante={$page.url.pathname === '/form/registro' ? 'proyeccion' : 'solicitud'} />

	<p class="text-lg my-8 text-zinc-600">
		Estimado docente, la fase de proyección consiste en la planificación y organización de las
		salidas de campo que se realizarán en el próximo semestre. Su participación es fundamental para
		estimar los costos de su salida de campo y solicitar los recursos financieros necesarios para su
		ejecución.
	</p>

	<slot />

	<Footer />
</div>
