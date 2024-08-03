<script lang="ts">
	import { auth, provider } from '$lib/client/firebase';
	import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

	let form: HTMLFormElement;
	async function login(): Promise<void> {
		const cred = await signInWithPopup(auth, provider);

		const token = await cred.user.getIdToken();
		await auth.signOut();

		console.log('token: ', token);

		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'token';
		input.value = token;
		form.appendChild(input);
		form.submit();
	}
</script>

<form method="post" bind:this={form}></form>

<button on:click={login} class="border rounded p-2 mt-10 bg-gray-800 text-white hover:bg-gray-700">
	Login using Google
</button>
