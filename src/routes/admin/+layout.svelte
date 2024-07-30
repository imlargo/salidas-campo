<script lang="ts">
	import '$styles/form.scss';

	import Footer from '$src/lib/components/layout/Footer.svelte';
</script>

<div class="py-5 mx-24">
	<slot />

	<Footer />
</div>
