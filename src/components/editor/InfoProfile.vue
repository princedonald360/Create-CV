<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { LICENSES, LIMITS } from '../../utils/constants'
import FormField from '../ui/FormField.vue'

const store = useCvStore()
</script>

<template>
  <section>
    <h2 class="section-title">Informations personnelles</h2>

    <div class="space-y-3">
      <FormField
        v-model="store.profile.fullName"
        label="Nom complet"
        placeholder="ex: Alexandre Martin"
        autocomplete="name"
        :maxlength="LIMITS.name"
        required
      />

      <FormField
        v-model="store.profile.jobTitle"
        label="Titre du poste"
        placeholder="ex: Développeur Full Stack"
        :maxlength="LIMITS.title"
        required
      />

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          v-model="store.profile.nationality"
          label="Nationalité"
          placeholder="ex: Ivoirienne"
          :maxlength="LIMITS.short"
        />
        <FormField
          v-model="store.profile.maritalStatus"
          label="Situation matrimoniale"
          placeholder="ex: Célibataire"
          :maxlength="LIMITS.short"
        />
        <FormField
          v-model="store.profile.email"
          label="Email"
          type="email"
          placeholder="ex: alexandre@email.com"
          autocomplete="email"
          :maxlength="LIMITS.email"
        />
        <FormField
          v-model="store.profile.phone"
          label="Téléphone"
          type="tel"
          placeholder="ex: +225 07 00 00 00 00"
          autocomplete="tel"
          inputmode="tel"
          :maxlength="LIMITS.phone"
          required
        />
      </div>

      <FormField
        v-model="store.profile.location"
        label="Localisation"
        placeholder="ex: Abidjan, Côte d'Ivoire"
        autocomplete="address-level2"
        :maxlength="LIMITS.location"
      />

      <!-- Permis de conduire -->
      <fieldset>
        <legend class="field-label">Permis de conduire</legend>
        <div class="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          <label
            v-for="license in LICENSES"
            :key="license"
            class="inline-flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-slate-700"
          >
            <input
              v-model="store.profile.driverLicence"
              type="checkbox"
              :value="license"
              class="h-4 w-4 rounded border-slate-300 accent-blue-600"
            />
            <span>{{ license }}</span>
          </label>
        </div>
      </fieldset>

      <FormField
        v-model="store.profile.summary"
        label="Résumé du profil"
        placeholder="Présentez-vous en quelques lignes : expérience, points forts, objectif…"
        multiline
        :rows="4"
        :maxlength="LIMITS.summary"
      />
    </div>
  </section>
</template>
