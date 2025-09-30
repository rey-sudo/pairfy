<template>
    <div>
        <editor-content v-if="product" :editor="editor" />
    </div>
</template>

<script setup>
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Editor, EditorContent } from '@tiptap/vue-3';

const productStore = useProductStore()

const product = computed(() => productStore.product)

const editor = ref(null);

const setupEditor = () => {
    editor.value = new Editor({
        editable: false,
        extensions: [
            StarterKit,
            TextStyle.configure({ types: [ListItem.name] }),
        ],
        editorProps: {
            attributes: {
                class: 'editor-class',
            },
        },
        content: product.value.description.html || "",
    })
}

watch(product, (value) => {
    if (value) {
        if (editor.value) {
            editor.value.commands.setContent(value.description.html)
        }
    }

}, { immediate: true, deep: true })

onMounted(() => {
    setupEditor();
})

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
    }
})

</script>

<style lang="css" scoped>
::v-deep(.editor-class) {
    font-weight: 300;
    line-height: 2rem;
    text-align: justify;
    color: var(--text-b);
    font-size: var(--text-size-3);
}


/* Default styles apply to all devices */

/* Small phones (up to 480px) */
@media (max-width: 480px) {
    ::v-deep(.editor-class) {
        padding: 0 1rem;
    }
}

/* Large phones and small tablets (481px - 767px) */
@media (min-width: 481px) and (max-width: 767px) {
    /* Styles for larger phones */
}

/* Tablets (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
    /* Styles for tablets */
}

/* Laptops and small desktops (1025px - 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
    /* Styles for laptops */
}

/* Large desktops (1441px and up) */
@media (min-width: 1441px) {
    /* Styles for large screens */
}
</style>