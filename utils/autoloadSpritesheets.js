// utils/autoloadSpritesheets.js
export function autoloadSpritesheets(scene) {
    const spritesheets = import.meta.glob('../assets/**/*.{png,jpg,jpeg}', { eager: true });

    const loadedAssets = [];

    Object.keys(spritesheets).forEach((filePath) => {
        const pathParts = filePath
            .replace('../assets/', '')
            .split('/');
        const characterName = pathParts[0];
        let actionName = pathParts[1];

        if (actionName) {
            actionName = actionName.replace(/\.(png|jpe?g)$/i, '');

            // 🔍 Tự động xác định frameWidth từ hậu tố
            let frameWidth = 128;
            const sizeMatch = actionName.match(/_zxc_(\d+)$/);
            if (sizeMatch) {
                frameWidth = parseInt(sizeMatch[1]);
                // ❗️Xóa hậu tố khỏi key để thống nhất tên animation
                actionName = actionName.replace(/_zxc_\d+$/, '');
            }

            const key = `${characterName}.${actionName}`;
            loadedAssets.push(key);

            const spriteSheetModule = spritesheets[filePath];
            if (spriteSheetModule && spriteSheetModule.default) {
                const fullPath = spriteSheetModule.default;
                scene.load.spritesheet(key, fullPath, {
                    frameWidth,
                    frameHeight: frameWidth
                });
                console.log(key, `loaded (${frameWidth}x${frameWidth})`);
            } else {
                console.error(`Invalid path or file URL for ${key}:`, spriteSheetModule);
            }
        }
    });

    return loadedAssets;
}
