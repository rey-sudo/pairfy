<template>
    <div class="Stepper flex">

        <div class="Stepper-box flex" v-for="(step, index) in steps" :key="index">
            <div class="Stepper-step flex">
                <div class="circle" :class="{ active: index === currentStep }">
                    {{ index + 1 }}
                </div>

                <div class="label" :class="{ active: index === currentStep }">
                    {{ step }}
                </div>
            </div>

            <div class="connector" :class="{ completed: index === 0 }" v-if="index !== steps.length - 1" />
        </div>

    </div>
</template>

<script setup>

const steps = ['Details Shipment', 'Order Payment', 'Package Shipping']
const currentStep = ref(0)
</script>

<style scoped>
.Stepper {
    font-size: var(--text-size-1);
    justify-content: space-between;
    margin: 1rem 0;
    width: 100%;
}

.Stepper-box {}

.Stepper-step {
    text-align: center;
    flex: 1;
}

.connector {
    width: 2rem;
    height: 2px;
    margin-left: 1rem;
    background: var(--border-a);
}

.connector.completed {
    background: var(--primary-a);
}

.circle {
    width: 1.5rem;
    display: flex;
    height: 1.5rem;
    font-weight: 500;
    min-width: 1.5rem;
    border-radius: 50%;
    align-items: center;
    color: var(--text-b);
    justify-content: center;
    border: 1px solid var(--border-a);
}

.circle.active {
    border: 1px solid transparent;
    background: var(--primary-a);
    color: var(--text-w);
}

.label {
    white-space: nowrap;
    margin-left: 0.75rem;
    color: var(--text-b);
}

.label.active {
    font-weight: bold;
    color: var(--text-a);
}
</style>