# create something form templates

create something form templates
## 功能
使用命令或菜单生成模版 
<br>
使用模版快捷生成代码文件

## 食用步骤
1. `ctrl+shift+p` 打开vscode命令
2. 输入 `init templates`
3. 输入模版的名称完成创建模版
4. 再次使用 `ctrl+shift+p` 打开vscode命令
5. 输入 `create from templates` 根据引导完成创建

## 命令
* `init templates` 创建模版
* `create from templates` 选择模版创建文件
（也可以在右键菜单中选择）

## 快捷键
### windows

* `ctrl+shift+i` 创建模版
* `ctrl+shift+t` 选择模版创建文件

### mac

* `cmd+shift+i` 创建模版
* `cmd+shift+t` 选择模版创建文件


## 模版文件格式
```{
  return {
    templateInterface: [
          {
            key: "xxxxx", // 需要插入模版的key
            label: "yyyyy",// 需要插入模版的key在创建时的提示文字
          }
        ],
    template: ({xxxxx})=>{
      return `import React from "react";

      const ${xxxxx} = () => {
        return <div>Hello World!</div>
      }
      
      export default ${xxxxx};
      `
    }
  }
}
```

## 可配置项

名称|简介|默认值|类型
|:---|:---|:---|:---
csft.templatesPath|项目中的模版地址|"templates"|string
csft.openWhenFinished|是否在每次创建后打开文件|true|boolean
csft.setFileExtendedName|创建文件的默认拓展名|null|string