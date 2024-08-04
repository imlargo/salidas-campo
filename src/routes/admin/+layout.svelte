<script lang="ts">
	import '$styles/form.scss';

	import Footer from '$src/lib/components/layout/Footer.svelte';
</script>

<div class="px-5 md:mx-auto md:max-w-7xl container py-5">
	<slot />

	<Footer />
</div>
