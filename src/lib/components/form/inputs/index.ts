export { default as TextInput } from "./TextInput.svelte";
export { default as NumberInput } from "./NumberInput.svelte";
export { default as EmailInput } from "./EmailInput.svelte";
export { default as PasswordInput } from "./PasswordInput.svelte";
export { default as DateTimeInput } from "./DateTimeInput.svelte";

export { default as SubmitButton } from "./SubmitButton.svelte";
export { default as ToggleButton } from "./ToggleButton.svelte";

export type DefaultProps<T = string> = {
    value?: T;
    label: string;
    required?: boolean;
    disabled?: boolean;
};
