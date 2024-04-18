<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'change', data: Blob): void }>()
const isRecording = ref(false)
const audioURL = ref('')
let mediaRecorder: MediaRecorder

const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    mediaRecorder = new MediaRecorder(stream)
    let chunks: Blob[] = []
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' })
      audioURL.value = URL.createObjectURL(blob)
      let file = new File([blob], 'recording.wav', {type: 'audio/wav'});
      emit('change', file)
    }
    mediaRecorder.start()
    isRecording.value = true
  })
}

const stopRecording = () => {
  mediaRecorder.stop()
  isRecording.value = false
}

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}
</script>

<template>
  <div class="recorder">
    <button @click="toggleRecording">{{ isRecording ? 'Stop' : 'Start' }} recording</button>
    <div v-if="audioURL">
      <audio controls :src="audioURL"></audio>
    </div>
  </div>
</template>

<style scoped>
.recorder {
  align-items: center;
  display: flex;
  column-gap: 16px;
}
</style>
