## 一、项目结构
```
├── build                   // 对 webpack 开发和打包的相关设置，包括入口文件、输出文件、使用的模块等；
├── mock                    // mock
├── node_modules            // node模块依赖
├── plop-templates          // 代码模板
├── public                  // 公共
├── src                     // src
    ├─api                   // 封装的所有请求
    ├─assets                // 主题、字体等静态资源    
    │  ├─401_images         // 401 无访问权限。
    │  ├─404_images         // 404
    │  └─custom-theme       // 主题├
    │      └─fonts          // 字体
    ├─components            // 全局公用组件 
    │  ├─BackToTop
    │  ├─Breadcrumb
    │  ├─Charts
    │  │  └─mixins
    │  ├─DndList
    │  ├─DragSelect
    │  ├─Dropzone
    │  ├─ErrorLog
    │  ├─GithubCorner
    │  ├─Hamburger
    │  ├─HeaderSearch
    │  ├─ImageCropper
    │  │  └─utils
    │  ├─JsonEditor
    │  ├─Kanban
    │  ├─MarkdownEditor
    │  ├─MDinput
    │  ├─Pagination
    │  ├─PanThumb
    │  ├─RightPanel
    │  ├─Screenfull
    │  ├─Share
    │  ├─SizeSelect
    │  ├─Sticky
    │  ├─SvgIcon
    │  ├─TextHoverEffect
    │  ├─ThemePicker
    │  ├─Tinymce
    │  │  └─components
    │  ├─Upload
    │  └─UploadExcel
    ├─directive             // 全局指令
    │  ├─clipboard
    │  ├─el-drag-dialog
    │  ├─el-table
    │  ├─permission
    │  └─waves
    ├─filters               // 全局 filter
    ├─icons                 // 项目所有 svg icons
    │  └─svg
    ├─layout                // 布局组件
    │  ├─components
    │  │  ├─Settings
    │  │  ├─Sidebar
    │  │  └─TagsView
    │  └─mixin
    ├─router                // 路由
    │  └─modules
    ├─store                 // 全局store管理
    │  └─modules
    ├─styles                // 全局样式
    ├─utils                 // 全局公用方法
    ├─vendor                // 公用vendor
    └─views                 // view页面
    │   ├─charts
    │   ├─clipboard
    │   ├─components-demo
    │   ├─dashboard
    │   │  ├─admin
    │   │  │  └─components
    │   │  │      ├─mixins
    │   │  │      └─TodoList
    │   │  └─editor
    │   ├─documentation
    │   ├─error-log
    │   │  └─components
    │   ├─error-page
    │   ├─example
    │   │  └─components
    │   │      └─Dropdown
    │   ├─excel
    │   │  └─components
    │   ├─guide
    │   ├─icons
    │   ├─login
    │   │  └─components
    │   ├─nested
    │   │  ├─menu1
    │   │  │  ├─menu1-1
    │   │  │  ├─menu1-2
    │   │  │  │  ├─menu1-2-1
    │   │  │  │  └─menu1-2-2
    │   │  │  └─menu1-3
    │   │  └─menu2
    │   ├─pdf
    │   ├─permission
    │   │  └─components
    │   ├─profile
    │   │  └─components
    │   ├─qiniu
    │   ├─redirect
    │   ├─systemmanagement
    │   ├─tab
    │   │  └─components
    │   ├─table
    │   │  └─dynamic-table
    │   │      └─components
    │   ├─theme
    │   └─zip
    │── App.vue             // 入口页面
    │── main.js             // 入口，加载组件，初始化等
    │── permission.js       // 权限管理
```

## 二、目录
### 2.1、api & views
api层作为一个公共的接口层，定义了所有的请求，很好保证了各个界面应用层的数据一致性。   
view作为展示层，包含了业务结构和展示效果。   
总之，api提供数据，view提供业务机构，两个结合起来就是一个完整的页面。  
随着业务的迭代，模块还会会越来越多，所以这里建议根据业务模块来划分 views，并且 将views 和 api 两个模块一一对应。

### 2.2、componentsresolve(__dirname, 'src')
放置的都是全局公用的一些组件，如上传组件，富文本等等。一些页面级的组件建议还是放在各自views文件下，方便管理。

### 2.3、store
有些数据还是需要用 vuex 来统一管理的，如登录token,用户信息，或者是一些全局个人偏好设置等，还是用vuex管理更加的方便，具体当然还是要结合自己的业务场景的。总之，不要为了用vuex而用vuex！

## 三、ESLint
安装eslint插件

安装并配置完成 ESLint 后，我们继续回到 VSCode 进行扩展设置，依次点击 文件 > 首选项 > 设置 打开 VSCode 配置文件,添加如下配置
```
"files.autoSave":"off",
    "eslint.validate": [
       "javascript",
       "javascriptreact",
       "html",
       { "language": "vue", "autoFix": true }
     ],
     "eslint.options": {
        "plugins": ["html"]
     }
```

## 四、Axios
见：src/utils/request.js

## 五、多环境
package.json
```
"dev": "vue-cli-service serve",
"build:prod": "vue-cli-service build",
"build:stage": "vue-cli-service build --mode staging",
```
代码引用：   
process.env.VUE_APP_BASE_API

## 六、前后端交互
### 6.1、跨域问题
可以在后端配置：com.fallframework.platform.starter.control.config.CorsConfig

dev环境也可以通过 webpack-dev-server的proxy来解决，开发环境用nginx反代理一下就好了。

### 6.2、前端mock
可以使用 mock server 或者使用 mockjs + rap 或者 easy-mock 结合 swagger。

### 6.3、iconfont
阿里的 iconfont 它提供了png,ai,svg三种格式，同时使用也支持unicode，font-class，symbol三种方式。
 
### 6.4、优化
```
npm install
npm run build:prod
加打包镜像，一共是耗时如下
```
主站PC站基于nodejs、Vue实现服务端渲染，所以不仅需要依赖nodejs，而且需要利用pm2进行nodejs生命周期的管理。为了加速线上镜像构建的速度，我们利用taobao源 registry.npm.taobao.org 进行加速, 并且将一些常见的npm依赖打入了基础镜像，避免每次都需要重新下载。

这里注意下 建议不要使用cnpm install或者update 它的包都是一个link，反正会有各种诡异的bug，这里建议这样使用
```
npm install --registry=https://registry.npm.taobao.org
```
可优化的空间如使用webpack dll 或者把那些第三方vendor单独打包 external出去，或者使用http2 可以使用AggressiveSplittingPlugin等等，这里有需求的可以自行优化。

