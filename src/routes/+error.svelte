<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import Footer from '$src/lib/components/layout/Footer.svelte';
</script>

<div class="max-w-7xl mx-auto container py-5">
	<Banner variante="proyeccion" titulo="Ups, pagina no encontrada"></Banner>

	<div class="py-12">
		<h1 class="text-center font-bold text-3xl">Pagina no encontrada</h1>

		<p class="mt-3 text-zinc-600 text-center">
			La pagina a la que has intentado acceder no existe, por favor verifica la URL e intenta de
			nuevo.
		</p>
	</div>

	<Footer />
</div>
