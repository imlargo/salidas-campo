<script lang="ts">
	import { page } from '$app/stores';

	import '$styles/form.scss';
	import Footer from '$components/layout/Footer.svelte';
</script>

<div class="max-w-7xl mx-auto container py-5">
	<slot />

	<Footer />
</div>
