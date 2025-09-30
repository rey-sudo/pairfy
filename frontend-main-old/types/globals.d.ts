import type { Lucid } from 'lucid-cardano'
import type * as CSL from '@emurgo/cardano-serialization-lib-browser'
import type { Connector } from '@cardano-foundation/cardano-connect-with-wallet-core'

declare module '#app' {
  interface NuxtApp {
    $lucid: Lucid
    $csl: typeof CSL
    $connector: Connector
  }
}


declare global {
  interface Window {
    cardano?: any
  }
}