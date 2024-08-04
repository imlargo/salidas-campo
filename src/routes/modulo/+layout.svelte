<script lang="ts">
	import '$styles/form.scss';

	import Footer from '$src/lib/components/layout/Footer.svelte';
</script>

<div class="p-5 md:mx-12">
	<slot />

	<Footer />
</div>
