const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatchPkg = require('pixelmatch');
const pixelmatch = typeof pixelmatchPkg === 'function' ? pixelmatchPkg : pixelmatchPkg.default;

class VisualRegressionHelper {
    constructor() {
        this.baselineDir = path.join(__dirname, '../visual-baseline');
        this.currentDir = path.join(__dirname, '../visual-current');
        this.diffDir = path.join(__dirname, '../visual-diff');

        [this.baselineDir, this.currentDir, this.diffDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    saveCurrentScreenshot(sourcePath, filename) {
        const src = path.join(__dirname, '..', sourcePath);
        const dest = path.join(this.currentDir, filename);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
        }
    }

    async compareImages(filename) {
        const baselinePath = path.join(this.baselineDir, filename);
        const currentPath = path.join(this.currentDir, filename);
        const diffPath = path.join(this.diffDir, filename);

        if (!fs.existsSync(baselinePath)) {
            return { hasBaseline: false, match: false };
        }

        const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
        const img2 = PNG.sync.read(fs.readFileSync(currentPath));

        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const numDiffPixels = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            { threshold: 0.1 }
        );

        const totalPixels = width * height;
        const matchPercentage = ((totalPixels - numDiffPixels) / totalPixels) * 100;
        const match = numDiffPixels === 0;

        fs.writeFileSync(diffPath, PNG.sync.write(diff));

        return {
            hasBaseline: true,
            match: match,
            matchPercentage: Number(matchPercentage.toFixed(2)),
            diffPath: diffPath,
            message: match ? 'Images are identical' : `Found ${numDiffPixels} different pixels`
        };
    }

    saveAsBaseline(filename) {
        const currentPath = path.join(this.currentDir, filename);
        const baselinePath = path.join(this.baselineDir, filename);
        if (fs.existsSync(currentPath)) {
            fs.copyFileSync(currentPath, baselinePath);
        }
    }
}

module.exports = VisualRegressionHelper;