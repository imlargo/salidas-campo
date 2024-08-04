<script lang="ts">
	type Props = {
		variante: string;
		titulo: string;
	};
	const { variante, titulo }: Props = $props();
</script>

<header
	class="flex flex-col sm:flex-row sm:justify-between rounded-xl px-8 py-4 sm:px-16 sm:py-5 variante-{variante}"
>
	<div class="w-75">
		<h1 class="block text-2xl sm:text-4xl font-semibold">{titulo}</h1>
		<div class="separador w-3/4"></div>
	</div>

	<div class="flex sm:justify-end items-center gap-3 w-full sm:w-1/4">
		<slot />
	</div>
</header>

<style lang="scss">
	.variante-proyeccion {
		background-color: #ff9b21;

		.separador {
			border: 4px solid #fecf50;
		}
	}

	.variante-solicitud {
		background-color: #ad3257;

		.separador {
			border: 4px solid #db557d;
		}
	}

	header {
		height: auto;
		contain: content;

		h1 {
			color: white;
			font-family: 'Ancizar sans', Tahoma, Geneva, sans-serif;
			margin-block-start: 1em;
			margin-inline-end: 0px;
		}

		.separador {
			margin: 1em 0;
			border-radius: 10px;
			display: block;
		}
	}
</style>
