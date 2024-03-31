import { path } from '@tauri-apps/api'
import { Client, Stronghold } from 'tauri-plugin-stronghold-api'

import { STRONGHOLD_CLIENT, STRONGHOLD_KEY } from '~/utils/secrets'

const STRONGHOLD_NAME = 'storage.osc'

const TEXT_ENCODER = new TextEncoder()
const TEXT_DECODER = new TextDecoder()
class StorageService {
  private _stronghold: Stronghold
  private _client: Client

  public async initialize(): Promise<void> {
    const appDataDir = await path.appDataDir()
    const strongholdPath = await path.resolve(appDataDir, STRONGHOLD_NAME)
    this._stronghold = await Stronghold.load(strongholdPath, STRONGHOLD_KEY)

    try {
      this._client = await this._stronghold.loadClient(STRONGHOLD_CLIENT)
    } catch {
      this._client = await this._stronghold.createClient(STRONGHOLD_CLIENT)
    }
  }

  public async get<R>(key: string, defaultValue?: R): Promise<R> {
    const store = this._client.getStore()

    const rawData = await store.get(key)

    if (rawData == null || rawData.length === 0) {
      return defaultValue ?? null
    }

    try {
      return JSON.parse(TEXT_DECODER.decode(rawData)) as R
    } catch {
      return defaultValue ?? null
    }
  }

  public async set<R>(key: string, value: R): Promise<R> {
    const store = this._client.getStore()

    await store.insert(key, Array.from(TEXT_ENCODER.encode(JSON.stringify(value))))
    await this._stronghold.save()

    return value
  }
}

export const storageService = new StorageService()
