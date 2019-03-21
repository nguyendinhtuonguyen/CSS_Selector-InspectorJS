# CssSelector-InspectorJS  

一个轻量级JavaScript库，通过单击网页上的任意位置来帮助您生成CSS选择器。  
一个开源库。:)随意在您的产品上使用它。  

## 是如何工作的？快速高级概述：  

通过单击捕获元素  
遍历DOM树，查询当前位置的父元素和全局文档（DOM）  
检查目标元素是否具有ID  
检查它是否具有全局文档唯一的类/标记  
检查它是否有一个类/标签，它的父母是唯一的  
支持'n-child'选择器  
继续构建一个选择器字符串，直到找到一个能够返回原始目标元素的字符串  
将完整的css选择器路径返回到用户定义的自定义回调  

**Notes**  

有时当使用css选择器返回时，Web浏览器无法识别。请在此处查看您的页面  

## 安装将脚本文件：inspector.js加载到您的应用程序：  

`<script type="text/javascript" src="..../src/inspector.js"></script>`
## 用法自加载页面以来，检查器可用  

通过调用window.inspector来使用  

## 选项：  

ignoreClasses：忽略传入的class选择 
hiddenClasses：将忽略其所有css  
## 快速上手
1.[js外挂](https://raw.githubusercontent.com/zctmdc/fakeQQInfo/master/loadByJS.js)  
```
  function loadScript(data) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.text = data;
    document.head.appendChild(script);
  }
  function ajaxget(url, fnSucceed) {   
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      xhr.readyState == 4 && xhr.status == 200 && fnSucceed && fnSucceed(xhr.responseText);
    };
    xhr.send();
  }
  ajaxget('https://raw.githubusercontent.com/zctmdc/CssSelector-InspectorJS/master/src/inspector.js', loadScript);
```

2.[jq外挂](https://raw.githubusercontent.com/zctmdc/fakeQQInfo/master/loadByJQ.js)  
```
  $.get('https://raw.githubusercontent.com/zctmdc/CssSelector-InspectorJS/master/src/inspector.js', function (data) {
    $('head').append($("<script type='text/javascript'></script>").text(data));
  });
```
```
  function clickedCallback(event, pathms) {
      console.log(event);
      console.log(pathms);
  }
  window.inspector.start(clickedCallback);
  ```
