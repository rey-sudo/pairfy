<template>
    <div class="OrderMetadata">

        <div class="OrderMetadata-body">
            <div class="title">
                <span>Shipping Information</span>
            </div>

            <template v-if="!visible">
                <div class="password-input">
                    <InputPassword v-model="passwordValue" @valid="passwordValueValid = $event.valid"
                        :label="passwordVersion" />
                </div>

                <ButtonSolid label="Unlock" outlined @click="onDecrypt" :disabled="disableButton" size="mini" icon
                    style="margin-top: 1rem;">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-lock-open-icon lucide-lock-open">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        </svg>
                    </template>
                </ButtonSolid>
            </template>
            <template v-if="visible">
                <div class="destination-layout">
                    <div class="card">
                        <p class="card-field"><strong>Guide:</strong> {{ parsedData.g }}</p>
                        <p class="card-field"><strong>Website:</strong> {{ parsedData.w }}</p>
                    </div>
                </div>
            </template>
        </div>

    </div>
</template>

<script setup>
import DOMPurify from 'dompurify';
import { decryptMessageWithPrivateKey, decryptAESGCM } from '@lovelacers/common-f';
import { z } from 'zod';

const orderStore = useOrderStore()
const authStore = useAuthStore()

const visible = ref(false)

const parsedData = ref({})

const passwordValue = ref(null)
const passwordValueValid = ref(false)

const disableButton = computed(() => !passwordValue.value || !passwordValueValid.value)

const passwordVersion = computed(() => `Password v${orderStore.order?.buyer_rsa_version}`)

/////////////////////////////////////////////////////////////////////

const unixTimestampMsString = z
    .string()
    .regex(/^\d+$/, { message: "Must be a numeric string (UNIX timestamp in ms)" })

const base64Regex = /^[A-Za-z0-9+/=]+$/;

const metadataSchema = z.strictObject({
    public: z.object({
        date: unixTimestampMsString,
        tolerance: unixTimestampMsString,
        appeal_until: unixTimestampMsString,
    }),
    private: z
        .string()
        .length(344, { message: "Must be exactly 344 characters long" })
        .regex(base64Regex, { message: "Must be a valid Base64-encoded string" }),
});

const sanitizedString = z
    .string()
    .min(1, "Wrong format")
    .transform((val) => DOMPurify.sanitize(val.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    }));

const encryptedSchema = z.object({
    v: z.enum(["1.0"]),
    g: sanitizedString,
    w: sanitizedString,
});

/////////////////////////////////////////////////////////////////////

const onDecrypt = async () => {
    try {
        if (!import.meta.client) return

        if (!orderStore.shipping) {
            throw new Error('Empty shipping data')
        }

        if (!authStore.user) {
            throw new Error('Empty user data')
        }

        const validation1 = metadataSchema.safeParse(orderStore.shipping)

        if (!validation1.success) {
            throw new Error(`Invalid metadata format ${JSON.stringify(z.treeifyError(validation1.error))}`)
        }

        const shipping = validation1.data

        const encryptedPrivateKey = authStore.user.rsa_private_key[authStore.user.rsa_version]
        const privateKeyB64 = await decryptAESGCM(encryptedPrivateKey, passwordValue.value)

        const decrypted = decryptMessageWithPrivateKey(privateKeyB64, shipping.private)

        const validation2 = encryptedSchema.safeParse(JSON.parse(decrypted))

        if (!validation2.success) {
            throw new Error(`Invalid encrypted format ${JSON.stringify(z.treeifyError(validation2.error))}`)
        }

        parsedData.value = validation2.data

        visible.value = true

    } catch (err) {
        console.error(err)
        orderStore.showToast(err, 'error', 10_000)
    }
}
</script>

<style lang="css" scoped>
.OrderMetadata {
    width: 100%;
}

.OrderMetadata-body {
    width: 428px;
    padding: 1rem;
    display: flex;
    margin-top: 1rem;
    overflow: hidden;
    margin-left: auto;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: var(--radius-d);
    transition: var(--transition-a);
    border: 2px solid var(--border-a);
}

.title {
    font-size: var(--text-size-2);
    font-weight: 700;
}

.password-input {
    width: 100%;
    display: flex;
    margin-top: 1rem;
    align-items: center;
}

.show-button {
    display: flex;
    cursor: pointer;
    margin-top: 1rem;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--primary-a);
    padding: var(--input-padding);
    border: 1px solid var(--primary-a);
    border-radius: var(--button-radius);
}

.show-button span {
    margin-left: 0.5rem;
}

.destination-layout {
    border: 1px solid var(--border-a);
    background: var(--background-b);
    border-radius: var(--radius-b);
    margin-top: 1rem;
    padding: 1rem;
}

.card {
    max-width: 400px;
    border-radius: var(--radius-c);
}

.card-title {
    margin-top: 0;
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--text-b);
    font-size: var(--text-size-2);
}

.card-field {
    margin: 0.5rem 0;
    color: var(--text-b);
    font-size: var(--text-size-1);
}
</style>