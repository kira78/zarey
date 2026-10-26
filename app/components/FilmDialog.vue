<script setup lang="ts">
// Film de marque en plein écran. La vidéo n'est chargée qu'à l'ouverture.
const dialog = ref<HTMLDialogElement | null>(null)
const src = ref('')
const { $lenis } = useNuxtApp()

function open() {
  src.value = '/media/film.mp4'
  $lenis?.stop()
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
}
function onClose() {
  src.value = ''
  $lenis?.start()
}

defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(1100px,94vw)] overflow-visible bg-transparent p-0 backdrop:bg-ink/90"
    aria-label="Film ZAREY"
    @close="onClose"
    @click.self="close"
  >
    <div class="relative overflow-hidden rounded-[28px] border-2 border-white bg-ink">
      <video v-if="src" :src="src" class="aspect-video w-full" controls autoplay playsinline preload="auto" />
    </div>
    <button type="button" class="btn btn-yellow absolute -top-16 right-0" @click="close">Fermer</button>
  </dialog>
</template>
