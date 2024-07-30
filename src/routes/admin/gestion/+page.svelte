<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import Section from '$src/lib/components/form/Section.svelte';

	import { showPicker } from '$src/lib/util/utils';

	const { data } = $props();

	const { sizes, config, internalData } = data;
	import { controllerDashboard } from '$src/lib/client/controllers/dashboard.svelte';
</script>

<Banner titulo="Gestion Solicitudes" variante="proyeccion">
	<a href="/admin/dashboard" class="nav-link"><i class="bi bi-house"></i> Dashboard</a>
</Banner>

<main class="py-12 flex flex-col w-full gap-8">
	<!-- Descargar reportes -->
</main>

<style lang="scss">
</style>
