const path = require("path");
const fs = require('fs')
const minify = require('minify');

const buildPathCocos = './build/web-mobile/'
const buildPathTarget = './build-inline/'
const dapiPath = './dapi.js'
const mindworkApiPath = './mindworkapi.js'
const tiktokApiPath = './playable-sdk.js'
const ironsourceApiPath = './ironsource_api.js'

let args = process.argv.slice(2);
let adsNetwork;
if (typeof(args[0]) == undefined) {
    adsNetwork = 'google';
} else {
    adsNetwork = args[0];
}

console.log(`Build html file for ads network ${adsNetwork}\n`);

buildInlineHTML()

async function buildInlineHTML(){
    if (!fs.existsSync(buildPathTarget)) fs.mkdirSync(buildPathTarget, { recursive: true });

    let htmlFileContent = await fs.promises.readFile(`${buildPathCocos}index.html`, 'utf8');
    // Remove CSS & favicon
    htmlFileContent = htmlFileContent.replace(/<link(.+?)\/>/gs, '')

    // Replace CSS
    let cssFileContent = await fs.promises.readFile(`${buildPathCocos}style-mobile.css`, 'utf8')
    cssFileContent = cssFileContent.replace('./splash.png', '')
    htmlFileContent = await addScriptContentToHTML(htmlFileContent, cssFileContent, 'head', 'style')

    // Remove all script in HTML
    htmlFileContent = htmlFileContent.replace(/<script(.+?)\/script>/gs, '')
    
    // Replace Script
    let cocosLibContent = await fs.promises.readFile(`${buildPathCocos}cocos2d-js-min.js`, 'utf8');
    cocosLibContent = cocosLibContent.replace(/new XMLHttpRequest/g, 'new CustomXMLHttpRequest')
    cocosLibContent = cocosLibContent.replace(/new Image\)/g, `new Image);${getFunctionBody(injectLoadDomImage.toString())}`)
    cocosLibContent = cocosLibContent.replace('document.createElement("script")', 'new CustomCreateScript()')
    htmlFileContent = await addScriptContentToHTML(htmlFileContent, cocosLibContent)
    htmlFileContent = await addScriptToHTML(htmlFileContent, `${buildPathCocos}src/settings.js`)
    htmlFileContent = await addScriptToHTML(htmlFileContent, `${buildPathCocos}main.js`)

    if (adsNetwork == "google") {
        console.log(`--- Add google ads script`);
        htmlFileContent = await addScriptSourceToHTML(htmlFileContent, 'https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js', 'head')
    }

    if (adsNetwork == "ironsource") {
        console.log(`--- Add ironsources ads script`);
        let dapiContent = await fs.promises.readFile(`${dapiPath}`, 'utf8')
        htmlFileContent = await addScriptContentToHTML(htmlFileContent, dapiContent)
        let apiContent2 = await fs.promises.readFile(`${ironsourceApiPath}`, 'utf8')
        htmlFileContent = await addScriptContentToHTML(htmlFileContent, apiContent2)
    }

    if (adsNetwork == "mindwork") {
        console.log(`--- Add mindwork ads script`);
        let apiContent = await fs.promises.readFile(`${mindworkApiPath}`, 'utf8')
        htmlFileContent = await addScriptContentToHTML(htmlFileContent, apiContent)
    }

    if (adsNetwork == "unity") {
        console.log(`--- Add unity script`);
    }
	
	if (adsNetwork == "tiktok") {
        console.log(`--- Add mindwork ads script`);
        let apiContent = await fs.promises.readFile(`${tiktokApiPath}`, 'utf8')
        htmlFileContent = await addScriptContentToHTML(htmlFileContent, apiContent)
    }


    htmlFileContent = await addScriptContentToHTML(htmlFileContent, `${injectCustomScript.toString()};injectCustomScript();`, 'body')
    htmlFileContent = htmlFileContent.replace(/<\/script><script>/g, ';')

    // add this to the end to increase confusion while reading html file
    htmlFileContent = await addScriptContentToHTML(htmlFileContent, await bundleAssetToScript(), 'body')
    
    console.log('\n')

    htmlFileContent = htmlFileContent.replace(/<\/script><script>/g, ';')
    await fs.promises.writeFile(`${buildPathTarget}index-full.html`, htmlFileContent, 'utf8');
    console.log(`Output saved to: ${buildPathTarget}index-full.html (${await formatBytes(htmlFileContent.length)})`)

    const minifyOptions = {
        html: {
            removeOptionalTags: false
        },
    };
    const minifyFileContent = await minify(`${buildPathTarget}index-full.html`, minifyOptions)

    await fs.promises.writeFile(`${buildPathTarget}index_${adsNetwork}.html`, minifyFileContent, 'utf8');
    console.log(`Minify File saved to: ${buildPathTarget}index_${adsNetwork}.html (${await formatBytes(minifyFileContent.length)})`)

}
function getFunctionBody(fnStr){
    return fnStr.slice(fnStr.indexOf("{") + 1, fnStr.lastIndexOf("}"));
}
function injectLoadDomImage(){
    var temp = new Image();
    temp.src = window.bundleAsset[arguments[0]];
    setTimeout(()=>{ arguments[2] && arguments[2](null, temp)}, 10);
    return temp;
}
function injectCustomScript(){
    setTimeout(window.boot, 1)

    window.CustomCreateScript = function(){
        var scriptElement = document.createElement('script')
        scriptElement.removeEventListener = function(){}
        scriptElement.addEventListener = function(eventName, cb){
            this.src = ''
            if(eventName === 'load') setTimeout(() => {cb && cb()}, 10)
        }
        return scriptElement
    }

    var xmlHttp = window.CustomXMLHttpRequest = function(){}
    xmlHttp.prototype.send = function(){}
    xmlHttp.prototype.open = function(method, url){
        const self = this
        this.status = 200
        this.url = url
        this.isloaded = true
        
        const jsonExtension = url.match(/\.(json)(\?[a-z0-9=&.]+)?$/)
        const imageExtension = url.match(/\.(jpe?g|png|svg|bmp|gif)(\?[a-z0-9=&.]+)?$/)
        const audioExtension = url.match(/\.(wav|mp3|ogg)(\?[a-z0-9=&.]+)?$/)

        if(jsonExtension) {
            this.response = atob(window.bundleAsset[url])
        }
        else if(imageExtension){
            this.isloaded = false
            fetch(window.bundleAsset[url]).then(res => res.blob()).then(res => {
                self.response = res
                self.onload && self.onload()
            })
        }
        else if(audioExtension){
            this.response = Uint8Array.from(atob(window.bundleAsset[url]), c => c.charCodeAt(0)).buffer
        }
    }
    xmlHttp.prototype.setRequestHeader = function(){}
    xmlHttp.prototype.send = function(){this.isloaded && this.onload && this.onload()}
}
async function addScriptToHTML(htmlFileContent, scriptPath, htmlTag = 'head'){
    const scriptContent = await fs.promises.readFile(scriptPath, 'utf8');
    return addScriptContentToHTML(htmlFileContent, scriptContent, htmlTag)
    
} 
async function addScriptContentToHTML(htmlFileContent, scriptContent, htmlTag = 'head', scriptTag = 'script'){
    console.log(`Add ${scriptTag} to HTML <${htmlTag}>: ` + (scriptContent.substr(0, 50)))
    const lastIndex = htmlFileContent.lastIndexOf(`</${htmlTag}>`);
    return `${htmlFileContent.substr(0, lastIndex)}<${scriptTag}>${scriptContent}</${scriptTag}>${htmlFileContent.substr(lastIndex)}`
}
async function addScriptSourceToHTML(htmlFileContent, scriptSrc, htmlTag = 'head', scriptTag = 'script'){
    console.log(`Add ${scriptTag} to HTML <${htmlTag}>: ` + scriptSrc)
    const lastIndex = htmlFileContent.lastIndexOf(`</${htmlTag}>`);
    return `${htmlFileContent.substr(0, lastIndex)}<${scriptTag} type="text/javascript" src="${scriptSrc}"></${scriptTag}>${htmlFileContent.substr(lastIndex)}`
}
async function bundleAssetToScript(){
    const listAssets = await getAllAssetFiles()
    let bundleAssetScript = 'window.bundleAsset={'
    
    for (const assetPath of listAssets) {
        console.log(`   Start Load Asset: ${assetPath}`)
        const assetLocalPath = assetPath.replace(buildPathCocos.replace('./', ''), '')
        const scriptExtension = assetPath.match(/\.(js)(\?[a-z0-9=&.]+)?$/)
        const jsonExtension = assetPath.match(/\.(json)(\?[a-z0-9=&.]+)?$/)
        const imageExtension = assetPath.match(/\.(jpe?g|png|svg|bmp|gif)(\?[a-z0-9=&.]+)?$/)
        const audioExtension = assetPath.match(/\.(wav|mp3|ogg)(\?[a-z0-9=&.]+)?$/)

        const assetFileContentBase64 = await fs.promises.readFile(assetPath, 'base64');
        if(imageExtension) {
            let imageExt = imageExtension[1]
            if(imageExt === 'jpg') imageExt = 'jpeg'
            bundleAssetScript += `'${assetLocalPath}':'data:image/${imageExt};base64,${await fs.promises.readFile(assetPath, 'base64')}',`
        }
        else if(audioExtension) {
            bundleAssetScript += `'${assetLocalPath}':'${await fs.promises.readFile(assetPath, 'base64')}',`
        }
        else if(jsonExtension) {
            bundleAssetScript += `'${assetLocalPath}':'${await fs.promises.readFile(assetPath, 'base64')}',`
        }
        else if(scriptExtension){
            bundleAssetScript = `${await fs.promises.readFile(assetPath, 'utf8')};${bundleAssetScript}`
        }
        else {
            console.log(`Unhandled file extension : ${assetPath}`)
        }
    }

    bundleAssetScript += '};'
    return bundleAssetScript
}
async function getAllAssetFiles(){
    let listFiles = []

    const getAllFilesInFolderRecursive = (folderPath) => {
        fs.readdirSync(folderPath).forEach(filePath => {
            const fileAbsolutePath = path.join(folderPath, filePath).replace(/\\/g, '/');
            if (fs.statSync(fileAbsolutePath).isDirectory()) getAllFilesInFolderRecursive(fileAbsolutePath);
            else listFiles.push(fileAbsolutePath);
        });
    }
    getAllFilesInFolderRecursive(buildPathCocos + 'assets')

    return listFiles;
}

async function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}