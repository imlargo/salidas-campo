<script lang="ts">
	import Banner from '$src/lib/components/form/Banner.svelte';
	import { validarFechaActual } from '$src/lib/util/utils';
	import TablaProyecciones from '$src/lib/components/docente/TablaProyecciones.svelte';
	import TableSolicitudes from '$src/lib/components/docente/TableSolicitudes.svelte';

	const { data } = $props();
	const {
		config,
		solicitudActiva,
		proyeccionActiva,
		diasFaltantesProyeccion,
		diasFaltantesSolicitud,
		proyecciones,
		solicitudes
	} = data;

	const getColorAviso = (diasFaltantes: number) =>
		diasFaltantes >= 0 && diasFaltantes < 10
			? 'rojo'
			: diasFaltantes >= 10 && diasFaltantes < 15
				? 'naranja'
				: 'verde';
</script>

<Banner titulo="Modulo docente" variante="proyeccion">
	<a href="/admin/dashboard" class="nav-link"><i class="bi bi-house"></i> Docente</a>
</Banner>

<main class="py-12 w-full">
	{#if proyeccionActiva}
		<section>
			<div class="flex items-center justify-center">
				<a href="/form/proyeccion" class="btn-primary text-xl font-semibold">
					<span>Agregar otra salida de campo</span>
					<i class="bi bi-arrow-right"></i>
				</a>
			</div>

			<div class="flex justify-center items-center py-6">
				<span class="dias-faltantes-{getColorAviso(diasFaltantesProyeccion)} dias-faltantes">
					<i class="bi bi-info-circle"></i>
					<span class="delineado">
						Faltan <span class="font-bold">{diasFaltantesProyeccion}</span> dias para que se cierre el
						formulario de proyeccion
					</span>
				</span>
			</div>

			<div class="py-5">
				<TablaProyecciones {proyecciones} {solicitudes} />
			</div>
		</section>
	{/if}

	{#if solicitudActiva}
		<hr class="my-12" />

		<section>
			<div class="flex items-center justify-center">
				<a href="/form/solicitud" class="btn-primary text-xl font-semibold">
					<span>Crear solicitud en blanco</span>
					<i class="bi bi-arrow-right"></i>
				</a>
			</div>

			<div class="flex justify-center items-center py-6">
				<span class="dias-faltantes-{getColorAviso(diasFaltantesSolicitud)} dias-faltantes">
					<i class="bi bi-info-circle"></i>
					<span class="delineado">
						Faltan <span class="font-bold">{diasFaltantesSolicitud}</span> dias para que se cierre el
						formulario de solicitud
					</span>
				</span>
			</div>

			<div class="py-5">
				<TableSolicitudes {solicitudes} {proyecciones} />
			</div>
		</section>
	{/if}
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
