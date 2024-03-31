import { DummyModuleRender } from './DummyModuleRender'

export const dummyModule: OSCModule = {
  id: 'oscproject::dummy-module',
  displayName: 'Dummy',
  description: "I'm just a dummy module, I don't know why you would access me.",
  render: DummyModuleRender
}
