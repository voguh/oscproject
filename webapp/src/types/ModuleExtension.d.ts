// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface OSCModuleRenderProps {
  dimensions: Dimensions
}

declare interface OSCModule {
  id: string
  displayName: string
  description?: string
  render: React.ComponentType<OSCModuleRenderProps>
  onEvent?: (event: SEBaseEvent) => void
}
