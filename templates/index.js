module.exports = function getDefaultTemplate() {
  return defaultTemplate();
}

function defaultTemplate() {
  return `
{
  return {
    templateInterface: [
          {
            key: "xxxxx", // 需要插入模版的key
            label: "请输入页面名称",// 需要插入模版的key在创建时的提示文字
          }
        ],
    template: ({xxxxx})=>{
      return \`
import React from "react";  
const \${xxxxx} = () => {
    return <div>Hello World!</div>
}

export default \${xxxxx};
\`
    }
  }
}
`;
}
