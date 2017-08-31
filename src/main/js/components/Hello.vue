<!-- Example from https://github.com/Microsoft/TypeScript-Vue-Starter -->
<!-- As of now the vue project from https://github.com/DanielRosenwasser/vue/tree/accurateVueTypes is -->
<!-- required to make the Code syntactic clean ONLY if lang=ts -->
<!-- src/main/js/components/Hello.vue -->
<!-- NOT included anywhere down from webpack entry -->
<!-- NO ts-loader or sth. support, juts for MS VSCode Vetur showoff -->
<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: ['name', 'initialEnthusiasm'],
    data() {
        return {
            enthusiasm: this.initialEnthusiasm,
        }
    },
    methods: {
        increment() { this.enthusiasm++; },
        decrement() {
            if (this.enthusiasm > 1) {
                this.enthusiasm--;
            }
        },
    },
    computed: {
        exclamationMarks(): string {
            return Array(this.enthusiasm + 1).join('!');
        }
    }
});
</script>

<style>
.greeting {
    font-size: 20px;
}
</style>