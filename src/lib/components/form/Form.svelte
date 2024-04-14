<script lang="ts">
    type Props = {
        submit: (e: Event) => void;
    };

    let { submit }: Props = $props();

    const onsubmit = (e: Event) => {
        e.preventDefault();
        submit(e);
    };
</script>

<form {onsubmit}></form>
