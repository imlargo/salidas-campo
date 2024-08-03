<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';

	type Props = {
		proyeccion: Proyeccion;
	};

	const { proyeccion }: Props = $props();
</script>

<div>
	{proyeccion.asignatura?.COD_ASIGNATURA}
</div>
