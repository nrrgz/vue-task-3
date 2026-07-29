import { ref, watch, type Ref } from 'vue'

export type ValidationRule<TValue> = (value: TValue) => string | undefined

export type ValidationRules<TValues> = {
  [K in keyof TValues]?: ValidationRule<TValues[K]>[]
}

export type ValidationErrors<TValues> = Partial<Record<keyof TValues, string>>

export function required(message = 'This field is required'): ValidationRule<unknown> {
  return (value) => {
    if (value === null || value === undefined) return message
    if (typeof value === 'string' && value.trim() === '') return message
    if (Array.isArray(value) && value.length === 0) return message
    return undefined
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function email(message = 'Enter a valid email address'): ValidationRule<string> {
  return (value) => {
    if (!value) return undefined
    return EMAIL_PATTERN.test(value.trim()) ? undefined : message
  }
}

export function minLength(length: number, message?: string): ValidationRule<string> {
  return (value) => {
    if (!value) return undefined
    return value.trim().length >= length
      ? undefined
      : (message ?? `Must be at least ${length} characters`)
  }
}


export function useValidation<TValues extends Record<string, unknown>>(
  values: Ref<TValues>,
  rules: ValidationRules<TValues>,
) {
  const errors = ref<ValidationErrors<TValues>>({}) as Ref<ValidationErrors<TValues>>

  function firstErrorFor(field: keyof TValues): string | undefined {
    const fieldRules = rules[field]
    if (!fieldRules) return undefined

    for (const rule of fieldRules) {
      const message = rule(values.value[field])
      if (message !== undefined) return message
    }

    return undefined
  }

  function validateField(field: keyof TValues): boolean {
    const message = firstErrorFor(field)

    if (message === undefined) delete errors.value[field]
    else errors.value[field] = message

    return message === undefined
  }

  function validate(): boolean {
    let isValid = true

    for (const field of Object.keys(rules) as (keyof TValues)[]) {
      if (!validateField(field)) isValid = false
    }

    return isValid
  }

  function reset(): void {
    errors.value = {}
  }


  watch(
    values,
    () => {
      for (const field of Object.keys(errors.value) as (keyof TValues)[]) {
        validateField(field)
      }
    },
    { deep: true },
  )

  return { errors, validate, validateField, reset }
}
