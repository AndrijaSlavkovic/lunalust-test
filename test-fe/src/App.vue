<script setup lang="ts">
import { ref, computed } from 'vue'
import RecorderItem from './components/RecorderItem.vue'

let firstAudio = ref<Blob>()
let secondAudio = ref<Blob>()

let data = ref();

const disableCombine = computed(() => !firstAudio.value || !secondAudio.value)

const onChangeFirst = (data: Blob) => {
  firstAudio.value = data
}

const onChangeSecond = (data: Blob) => {
  secondAudio.value = data
}

const send = async () => {
  const formData = new FormData();

  if (firstAudio.value && secondAudio.value) {
    formData.append('files', firstAudio.value, 'firstAudio.wav');
    formData.append('files', secondAudio.value, 'secondAudio.wav');
  }

  const apiUrl = "http://localhost:3000/merge-audio";

  const response = await fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
  });
  let blob = await response.blob()
  const objectURL = URL.createObjectURL(blob);
	
  data.value = objectURL;
}
</script>

<template>
  <RecorderItem @change="onChangeFirst" />
  <RecorderItem @change="onChangeSecond" />
  <button @click="send()" :disabled="disableCombine">Combine</button>
  <div v-if="data">
      <audio controls :src="data"></audio>
    </div>
</template>

<style scoped></style>
