export { default as TextInput } from "./TextInput.svelte";

export type DefaultProps = {
    value: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
};
