<script lang="ts">
	type Props = {
		variante: string;
		titulo: string;
	};
	const { variante, titulo }: Props = $props();
</script>

<header class="flex justify-between rounded-xl variante-{variante}">
	<div class="px-12 w-75">
		<h1>{titulo}</h1>
		<div class="separador w-3/4"></div>
	</div>

	<div class="flex justify-end items-center gap-3 w-1/4 pe-12">
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
		padding: 1rem;

		h1 {
			font-weight: bolder;
			color: white;
			margin-bottom: 0em;
			line-height: 1.5em;

			font-size: 2.2em;

			font-family: 'Ancizar sans', Tahoma, Geneva, sans-serif;
			display: block;
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
