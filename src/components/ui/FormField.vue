<script setup>
import { useId } from 'vue'

defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  maxlength: { type: Number, default: undefined },
  rows: { type: Number, default: 3 },
  multiline: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: undefined },
  inputmode: { type: String, default: undefined },
  hint: { type: String, default: '' },
})

const model = defineModel({ type: [String, Number], default: '' })
const id = useId()
</script>

<template>
  <div>
    <label :for="id" class="field-label">
      {{ label }}<span v-if="required" class="text-red-500" aria-hidden="true"> *</span>
    </label>

    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="field-input resize-none"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      class="field-input"
    />

    <p v-if="multiline && maxlength" class="mt-1 text-right text-[10px] text-slate-400">
      {{ String(model ?? '').length }}/{{ maxlength }}
    </p>
    <p v-else-if="hint" class="mt-1 text-[11px] text-slate-400">{{ hint }}</p>
  </div>
</template>
