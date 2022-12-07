# create something form templates

create something form templates
## 功能
在根目录下创建模版文件夹（默认是templates）
在默认文件夹下创建你的模版
可以通过右键菜单来用自定义的模版来生成文件
也可以使用 ctrl+shift+i 来使用命令创建(mac使用cmd+shift+i)

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