<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import { validarFechaActual } from '$src/lib/util/utils';
	import TablaProyecciones from '$src/lib/components/docente/TablaProyecciones.svelte';

	const { data } = $props();
	const {
		config,
		solicitudActiva,
		proyeccionActiva,
		diasFaltantesProyeccion,
		diasFaltantesSolicitud,
		proyecciones
	} = data;

	const delineado =
		diasFaltantesProyeccion >= 0 && diasFaltantesProyeccion < 10
			? 'rojo'
			: diasFaltantesProyeccion >= 10 && diasFaltantesProyeccion < 15
				? 'naranja'
				: 'verde';
</script>

<Banner titulo="Modulo docente" variante="proyeccion">
	<a href="/admin/dashboard" class="nav-link"><i class="bi bi-house"></i> Docente</a>
</Banner>

<main class="py-12 w-full">
	<div class="flex items-center justify-center">
		<a href="/form/proyeccion" class="btn-primary text-xl font-semibold">
			<span>Agregar otra salida de campo</span>
			<i class="bi bi-arrow-right"></i>
		</a>
	</div>

	<div class="flex justify-center items-center py-6">
		<span class="dias-faltantes-{delineado} dias-faltantes">
			<i class="bi bi-info-circle"></i>
			<span class="delineado">
				Faltan <span class="font-bold">{diasFaltantesProyeccion}</span> dias para que se cierre el formulario
				de proyeccion
			</span>
		</span>
	</div>

	<div class="py-5">
		<TablaProyecciones {proyecciones} />
	</div>
</main>

<style lang="scss">
	.dias-faltantes {
		.delineado {
			text-decoration: underline;
			text-decoration-thickness: 2px;
			text-decoration-color: var(--color);
		}

		i {
			color: var(--color);
		}
	}

	.dias-faltantes-rojo {
		--color: #ff2164;
	}

	.dias-faltantes-naranja {
		--color: #f9ae00;
	}

	.dias-faltantes-verde {
		--color: #3cbd00;
	}
</style>
