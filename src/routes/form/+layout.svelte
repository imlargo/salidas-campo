<script lang="ts">
	import '$styles/form.scss';
	import Footer from '$components/layout/Footer.svelte';
</script>

<div class="px-5 md:max-w-7xl mx-auto container py-5">
	<slot />

	<Footer />
</div>
