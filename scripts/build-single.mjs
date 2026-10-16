import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
let require=createRequire(path.join(root,'package.json'));
try { require.resolve('vite'); } catch { if(!process.env.MES_BUILD_PACKAGE)throw Error('Run npm ci before building'); require=createRequire(process.env.MES_BUILD_PACKAGE); }
const {build}=await import(pathToFileURL(require.resolve('vite')).href);
const tailwind=(await import(pathToFileURL(require.resolve('@tailwindcss/vite')).href)).default;
const react=(await import(pathToFileURL(require.resolve('@vitejs/plugin-react')).href)).default;
const result=await build({configFile:false,root,publicDir:false,define:{'process.env.NODE_ENV':JSON.stringify('production')},plugins:[{
 name:'standalone-entry',enforce:'pre',
 resolveId(id){if(id==='lucide-react')return path.join(path.dirname(require.resolve('lucide-react/package.json')),'dist/esm/lucide-react.js');if(/^(react|react-dom|react-router|react-router-dom|lucide-react)(\/|$)/.test(id))return require.resolve(id)},
 async transform(code,id){
   if(id.replaceAll('\\','/').endsWith('/src/app/router.jsx'))code=code.replaceAll('createBrowserRouter','createHashRouter');
   for(const match of [...code.matchAll(/(["'])\/assets\/([^"']+)\1/g)]){
     const asset=path.resolve(root,'public/assets',match[2]);
     if(!asset.startsWith(path.resolve(root,'public/assets')+path.sep))throw Error('Asset path outside public/assets');
     const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'}[path.extname(asset).toLowerCase()];
     if(!mime)throw Error('Unsupported inline asset: '+asset);
     const data=await readFile(asset);
     code=code.replaceAll(match[0],JSON.stringify('data:'+mime+';base64,'+data.toString('base64')));
   }
   return code;
 }
},react(),tailwind()],build:{write:false,minify:'esbuild',cssMinify:true,cssCodeSplit:false,lib:{entry:path.join(root,'scripts/standalone-entry.jsx'),name:'MESDemo',formats:['iife']},rollupOptions:{output:{inlineDynamicImports:true}}}});
const output=(Array.isArray(result)?result[0]:result).output;
const js=output.filter(f=>f.type==='chunk').map(f=>f.code).join('\n');
const css=output.filter(f=>f.type==='asset'&&f.fileName.endsWith('.css')).map(f=>f.source).join('\n');
if(!js||!css)throw Error('Missing JavaScript or CSS');
const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Trạm Sorting/Rework G01 - MES Demo</title><style>${css.replaceAll('</style','<\\/style')}</style></head><body><div id="root"></div><script>${js.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile('MES-Demo.html',html);
console.log(`Single offline HTML: ${(Buffer.byteLength(html)/1024).toFixed(1)} KB`);


