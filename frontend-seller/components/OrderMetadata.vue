<template>
    <div class="OrderMetada">

        <div class="OrderMetada-body">
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
                        <span class="card-title">{{ parsedData.r }}</span>
                        <DividerComp margin="1rem 0px" />
                        <p class="card-field"><strong>Destination:</strong> {{ parsedData.d }}</p>
                        <p class="card-field"><strong>Preference:</strong> {{ parsedData.p }}</p>
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

const passwordVersion = computed(() => `Password v${orderStore.order?.seller_rsa_version}`)

/////////////////////////////////////////////////////////////////////

const base64Regex = /^[A-Za-z0-9+/=]+$/;

const metadataSchema = z.strictObject({
    public: z.object({}),
    private: z
        .string()
        .length(344, { message: "Must be exactly 344 characters long" })
        .regex(base64Regex, { message: "Must be a valid Base64-encoded string" }),
});

const sanitizedString = z
    .string()
    .min(1, "Wrong format")
    .max(300, "Wrong format")
    .transform((val) => DOMPurify.sanitize(val.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    }));

const encryptedSchema = z.object({
    v: z.enum(["1.0"]),
    r: sanitizedString,
    d: sanitizedString,
    p: sanitizedString.optional(),
});

/////////////////////////////////////////////////////////////////////

const onDecrypt = async () => {
    try {
        if (!orderStore.address) {
            throw new Error('Empty address')
        }

        if (!authStore.seller) {
            throw new Error('Empty seller data')
        }

        const validation1 = metadataSchema.safeParse(orderStore.address)

        if (!validation1.success) {
            throw new Error(`Invalid metadata format 1 ${JSON.stringify(z.treeifyError(validation1.error))}`)
        }

        const address = validation1.data

        const sellerPrivateKey = authStore.seller.rsa_private_key[authStore.seller.rsa_version]
        const privateKeyB64 = await decryptAESGCM(sellerPrivateKey, passwordValue.value)

        const decrypted = decryptMessageWithPrivateKey(privateKeyB64, address.private)

        console.log(decrypted)

        const validation2 = encryptedSchema.safeParse(JSON.parse(decrypted))

        if (!validation2.success) {
            throw new Error(`Invalid metadata format 2${JSON.stringify(z.treeifyError(validation2.error))}`)
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
.OrderMetada {
    width: 100%;
}

.OrderMetada-body {
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