const { exit } = require('process');
import { watch } from 'fs';

const watcher = watch(
    import.meta.dir,
    { recursive: true },
    async (event, filename) => {
        if (!filename.includes('dist-bun')) {
            console.log(`Detected ${event} in ${filename}`);
            // copy all icons
            Bun.write('./dist-bun/icon16.png', Bun.file('icon16.png'));
            Bun.write('./dist-bun/icon32.png', Bun.file('icon32.png'));
            // copy appropriate manifests
            const args = Bun.argv;
            const mode = args[2];
            const platform = args[3];

            if (!['chrome', 'firefox'].includes(platform)) {
                console.log(
                    'Unsupported Platform. Choose either chrome or firefox'
                );
                exit();
            } else {
                if (!['development', 'staging', 'production'].includes(mode)) {
                    console.log('Unsupported Mode. Choose dev,stage or prod');
                    exit();
                } else {
                    Bun.write(
                        `./dist-bun/manifest.json`,
                        Bun.file(
                            `./manifests/manifest.${platform}.${mode}.json`
                        )
                    );
                }
            }

            await Bun.build({
                entrypoints: [
                    'src/options.jsx',
                    'src/content-script.js',
                    'src/background.js'
                ],
                outdir: './dist-bun'
            });
        }
    }
);
