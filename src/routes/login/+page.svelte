<script lang="ts">
	import '$styles/form.scss';
	import Banner from '$components/form/Banner.svelte';
	import { getUserSession } from '$src/lib/client/user.js';
	import Modal from '$src/lib/components/ui/Modal.svelte';
	import type { UserData } from '$src/lib/types';
	import { toastController } from '$src/lib/stores/toastStore.svelte';

	const { data } = $props();
	const { uabs, from } = data;

	import { auth, provider } from '$lib/client/firebase';
	import { signInWithPopup } from 'firebase/auth';
	import { dbController } from '$lib/db/controller';

	let userSessionData: UserData | null = $state(null);

	let isLogged = $state(false);
	let modalInstance: SvelteComponent;

	let form: HTMLFormElement;
	async function login(): Promise<void> {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		isLogged = true;
		toastController.addMensaje('Iniciando sesion... Por favor espere');
		const token = await result.user.getIdToken();

		const userData = await dbController.getUser(user.email as string);

		// Si el usuario no es valido
		if (userData === null) {
			modalInstance.open();
			await auth.signOut();
			return;
		}

		// Si el usuario es valido
		userSessionData = getUserSession(user, userData, uabs);

		toastController.addMensaje(`Bienvenid@ ${userSessionData.nombre}`);

		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'token';
		input.value = token;
		form.appendChild(input);

		const inputFrom = document.createElement('input');
		inputFrom.type = 'hidden';
		inputFrom.name = 'from';
		inputFrom.value = from as string;
		form.appendChild(inputFrom);

		const userDataInput = document.createElement('input');
		userDataInput.type = 'hidden';
		userDataInput.name = 'userData';
		userDataInput.value = JSON.stringify(userSessionData);
		form.appendChild(userDataInput);

		form.submit();
	}

	import Footer from '$components/layout/Footer.svelte';
</script>

<svelte:head>
	<title>Iniciar Sesion - Salidas de campo</title>
</svelte:head>

<Modal
	bind:this={modalInstance}
	titulo="Ups! No tienes permiso de estar aqui."
	isConfirmacion={false}
	callback={() => {
		window.location.href = 'https://www.google.com';
	}}
>
	<p class="login-nota rounded ps-4 py-2">
		Solo los docentes de la facultad y las secretarias de departamento tienen acceso a esta
		aplicación. Por favor, inicia sesión con una cuenta autorizada para continuar.
	</p>
	<p class="mt-3">
		Recuerda que no se permite el acceso a monitores, estudiantes ni personas externas, solamente el
		docente puede ingresar.
	</p>
</Modal>

<div class="px-5 flex justify-center items-center h-screen">
	<div class="max-w-xl container">
		<Banner titulo="Iniciar Sesion" variante="proyeccion"></Banner>

		<div class="flex flex-col gap-7 py-5">
			<p class="text-pretty">
				Estimado(a) docente o secretaria, solo puede acceder al aplicativo de salidas de campo si ha
				iniciado sesión. Por favor, ingrese con su cuenta de Google.
			</p>

			<div class="login-nota rounded ps-4 py-4">
				<i class="bi bi-info-circle"></i>
				<span
					>Recuerde que para completar el formulario debe iniciar sesión con su cuenta de correo
					institucional.</span
				>
			</div>

			{#if isLogged}
				<button
					class="py-2 px-4 w-full rounded-lg shadow-lg border border-zinc-300 text-center font-semibold text-zinc-700"
				>
					<span
						>{userSessionData === null
							? 'Ingresando... Por favor espere'
							: `Bienvenid@ ${userSessionData.nombre}`}</span
					>
				</button>
			{:else}
				<button disabled={isLogged} onclick={login} type="button" class="btn-login">
					<span>Continuar con Google</span>
					<i class="bi bi-arrow-right"></i>
				</button>
			{/if}
		</div>

		<Footer />
	</div>

	<form method="post" bind:this={form}></form>
</div>

<style lang="scss">
	.btn-login {
		@apply py-2 px-4 w-full rounded-lg shadow-lg border border-zinc-500;

		color: #000000;
		font-weight: bold;

		background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
		background-color: #ffffff;
		background-repeat: no-repeat;
		background-position: 12px 11px;
	}

	.login-nota {
		background-color: rgb(238, 223, 255);
		position: relative;
		&::before {
			background-color: rgb(192, 136, 255);
			@apply rounded-tl-lg rounded-bl-lg;

			left: -0rem;
			content: '';
			display: block;
			height: 100%;
			position: absolute;
			width: calc(0.25em);
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>
