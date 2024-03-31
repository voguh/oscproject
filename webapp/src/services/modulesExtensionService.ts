class ModulesService {
  private readonly _store: Map<string, OSCModule>

  constructor() {
    this._store = new Map<string, OSCModule>()
  }

  public listModules(): OSCModule[] {
    return Array.from(this._store.values())
  }

  public getModule(modId: string): OSCModule {
    const mod = this._store.get(modId)
    if (mod == null) {
      throw new Error(`Module with id '${modId}' can't be founded!`)
    }

    return mod
  }

  public addModule(mod: OSCModule): void {
    if (mod == null || mod.id == null || mod.id.trim() === '') {
      throw new Error(`Empty module or missing module id!`)
    }

    if (this._store.has(mod.id)) {
      throw new Error(`Already exists an module with id '${mod.id}'!`)
    }

    this._store.set(mod.id, mod)
  }

  public removeModule(modId: string): void {
    const mod = this._store.get(modId)
    if (mod == null) {
      throw new Error(`Module with id '${modId}' can't be founded!`)
    }
    this._store.delete(modId)
  }
}

export const modulesExtensionService = new ModulesService()
