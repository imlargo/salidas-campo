<script lang="ts">
	import '$styles/app.scss';
	import 'tippy.js/dist/tippy.css';
	import Toast from '$src/lib/components/ui/Toast.svelte';
	import { storeAuth } from '$src/lib/stores/storeAuth.svelte';

	const { data } = $props();
	const { user, userData } = data;

	if (user && userData) {
		storeAuth.init(user, userData);
	}
</script>

<Toast />

<slot />
