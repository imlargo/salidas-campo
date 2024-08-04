<script lang="ts">
    import { page } from '$app/stores';
    import Banner from '$components/form/Banner.svelte';
</script>

<svelte:head>
	<title>Formulario de Proyeccion - Salidas de campo</title>
</svelte:head>

<Banner titulo={$page.error?.titulo} variante={$page.error?.tipo}>
	<a href="/modulo/docente" class="nav-link"><i class="bi bi-house"></i> Resumen</a>
</Banner>

<main>
    
<p class="text-lg my-8 text-zinc-600">
	{$page.error?.mensaje}
</p>
</main>


<style lang="scss">
	.field-layout {
		@apply grid gap-4;
	}
</style>
