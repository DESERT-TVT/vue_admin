const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { execSync } = require('child_process');

let target = 'admin-client';

const distPath = path.resolve(__dirname, '..', target);
let isExist = fs.existsSync(distPath);
if (!isExist) {
  console.error('打包的dist文件不存在');
  process.exit();
}

const packPath = path.resolve(__dirname, '..', 'pack');
isExist = fs.existsSync(packPath);
if (!isExist) {
  fs.mkdirSync(packPath);
}

try {
  const furyPath = path.resolve(__dirname, '..', target);

  const zipPath = path.resolve(__dirname, '..', `${target}.zip`);
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath)
  }

  const zip = new AdmZip();
  zip.addLocalFolder(furyPath); // 添加要压缩的文件

  zip.writeZip(zipPath); // 保存压缩文件

  console.log('生成发布包成功', zipPath);
} catch (error) {
  console.log('执行pack失败', error.message);
}
