# Handlebars 模板引擎
![](image/logo.jpg)
> Handlebars是JavaScript一个语义模板库，通过对view和data的分离来快速构建Web模板它采用"Logic-less template"（无逻辑模版）的思路，在加载时被预编译，而不是到了客户端执行到代码时再去编译， 这样可以保证模板加载和运行的速度
**优点:**
1.避免在js中写html代码
2.可读性好
3.易维护

## 安装
> 1.script引入 [下载](http://handlebarsjs.com/installation.html)
> 2.npm        `npm install hanlebars --save-dev`
> 3.bower         `bower install --save handlebars`

## 使用
[中文教程](http://www.ghostchina.com/introducing-the-handlebars-js-templating-engine/) 

### 基本使用
> 基本用法: {{}}
```
<script src="js/jquery.min.js"></script>
<script src="js/handlebars-v4.0.10.js"></script>
<!-- 模板内容 -->
<script id="tpl" type="text/x-handlebars-template">
    <div>姓名: {{ name }}</div>
    <div>出生日期: {{ birth }}</div>
    <div>出生地: {{ home }}</div>
    <div>职业: {{ job }}</div>
</script>
<script>
    //获取模板
    var tpl   =  document.getElementById('tpl').innerHTML;
    //预编译模板
    var template = Handlebars.compile(tpl);
    //模拟json数据
    var data = { name: "zhaoshuai", content: "learn Handlebars"};
    //匹配json内容
    var html = template(data);
    //输入模板
    document.getElementById('cont').innerHTML = html;
</script>
```
1.模板中的注释  {{!-- 注释 --}}

2. 循环遍历，用this来引用遍历的元素，例如
```
<ul>  
    {{#each name}}
        <li>{{this}}</li> {{!--this -> name中的每一个元素--}}
    {{/each}}
</ul>
json
{
    name: ["html","css","javascript"]
}
```


3.判断
如果if后面的参数返回false，undefined, null, "" 或者 []，Handlebar将不会渲染DOM
```
{{#if list}}
<ul id="list">  
    {{#each list}}
        <li>{{this}}</li>
    {{/each}}
</ul>  
{{else}}
    <p>{{error}}</p>
{{/if}}
json:
var data = {  
    info:['HTML5','CSS3',"WebGL"],
    "error":"数据取出错误"
}
```

4.unless
{{#unless}}这个语法是反向的if语法也就是当判断的值为false时他会渲染DOM
```
{{#unless data}}
<ul id="list">  
    {{#each list}}
        <li>{{this}}</li>
    {{/each}}
</ul>  
{{else}}
    <p>{{error}}</p>
{{/unless}}
```

5.Handlebars的访问（Path）
.访问属性  ../访问父级属性
```
<h1>{{author.id}}</h1>
json:
{
  title: "My First Blog Post!",
  author: {
    id: 47,
    name: "Yehuda Katz"
  },
  body: "My first post. Wheeeee!"
};
```
```
{{#with person}}
    <h1>{{../company.name}}</h1>
{{/with}}
json:
{
    "person":{ "name": "Alan" },
    company:{"name": "Rad, Inc." }
};
```

6.自定义标签 registerHelper
```
<ul>
    {{#each books}}
    <li {{#isfirst @index}} style="color:red;" {{/isfirst}} {{#if ../isBlue}}  style="color:blue" {{/if}}>
      {{addone @../index}}-{{addone @index}} {{this}}
    </li>
    {{/each}}
</ul>
//块级helper，用于判断, 返回this或true
Handlebars.registerHelper('dosomething', function(v1, [v2,] options){
    return value == 1 ? options.fn(this) : options.inverse(this);
});
{{#each this}}
<div class="card">  
    <div>{{chinese @index}}</div>
</div>
{/each}
//行内helper，用于转换值，可以看作是一个方法 chinese(value)
Handlebars.registerHelper('chinese', function(value){
    var arr = ['一','二','三'];
    if(this.books && this.books.length){
        this.isBlue = 1;
    }
    return arr[value];
});
```

7./*封装handelbars*/
```
(function($){
    $.fn.handlebars = function($tpl, data){
        $(this).html(Handlebars.compile($tpl.html())(data));
    };
})(jQuery);
$('.div').handlebars($('test-tpl'),data);
```
