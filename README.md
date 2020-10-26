# Left on Read

## Electron App

### Local Development

❗ Make sure a copy of your chat.db is on your Desktop first! 

1. run `yarn`
2.  Then run `yarn dev`.

#### Troubleshooting:

If you see:

```
Reading /Users/.../electron/node_modules/devtron/manifest.json failed.
Error: ENOENT: no such file or directory.
```

You most likely have an old electron process running. If this is warning, you can ignore it. Otherwise, kill the old process.