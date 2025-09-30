<template>
    <div class="SearchSection">
        <main class="SearchSection-body">
            <DividerComp />
            <ProductGrid title="Results" />
            <DividerComp invisible/>
        </main>
    </div>
</template>

<style scoped>
.SearchSection {
    width: 100%; 
    display: flex;
    justify-content: center;
}

.SearchSection-body {
    flex-direction: column;
    width: inherit;
    display: flex;
 
}
</style>