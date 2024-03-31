# Open Streamer Companion


## Development run

To run the project in development mode, it's necessary to create the files src/utils/secrets.rs and webapp/src/utils/secrets.ts.

Example:
```rust
// secrets.rs
pub static STRONGHOLD_SECRET: &str = "my-stronghold-secret";
```

```typescript
// secrets.ts
export const STRONGHOLD_KEY = 'my-stronghold-key'
export const STRONGHOLD_CLIENT = 'my-stronghold-client'
```


### Build

The command below will create a container of `Debian Bookworm` and will execute the `./zztools/build.sh` script.

The use of the Docker container is optional; if you choose to compile the project on the host system, simply use `yarn tauri build`.
You must ensure that the dependencies for each maker are correctly installed on your system.


```sh
docker run --rm -it -v "$(pwd)":/workdir -w /workdir debian:12.5 /workdir/zztools/build.sh
```