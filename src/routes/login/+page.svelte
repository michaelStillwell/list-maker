<section class="w-full text-token p-4 space-y-4 card">
	<form id="login" action="/login" method="POST" class="space-y-4">
		<label for="username" class="label">
			<span>Username</span>
			<input class="input" type="text" id="username" name="username" />
		</label>
		<label for="password" class="label">
			<span>Password</span>
			<input
				class="input"
				type="password"
				id="password"
				name="password"
			/>
		</label>

		<div class="flex justify-end space-x-4">
			<button class="btn variant-filled-secondary" type="button">
				<a href="/sign-up">Sign up</a>
			</button>
			<button class="btn variant-filled" type="submit" form="login">
				Login
			</button>
		</div>
	</form>
</section>
