<script lang="ts">
	export let startTime
	export let endTime
	let endStage = 0
</script>

<h1>You win!</h1>
<p>Your journey is over. Now, look back on the
{Math.round((endTime-startTime) / 1000)} seconds you spent playing.
Did you gain or lose anything of significance through this experience?</p>

<input type="button" value="Yes" disabled>
<input type="button" value="No" on:click={() => endStage = 1}>

{#if endStage == 1}
	<p>Oh, I'm sorry to hear that. I truly believed that the repeated act of
	mental calculation would result in a higher level of consciousness. You
	were even supposed to become a god. If you say that nothing significant
	was gained, then that must not have been happened. Would you like to see
	an interesting video to make up for it?</p>

	<!-- If you're reading this - DO NOT copy paste the YouTube link into a
	new tab. That would give you the "reward" without the work of doing the
	arithmetic, which would ruin it. I'm serious - play the game and reach it
	properly. -->

	<a target="_blank" href="https://www.youtube.com/watch?v=o-YBDTqX_ZU">
		<input type="button" value="Yes">
	</a>
	<input type="button" value="No" disabled>
{/if}
