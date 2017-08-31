/*封装handelbars*/
(function($){
    $.fn.handlebars = function($tpl, data){
        $(this).html(Handlebars.compile($tpl.html())(data));
    };
})(jQuery);

/*业务逻辑*/
$(function(){
	var GETCLASSES = "http://imoocnote.calfnote.com/inter/getClasses.php",
        GETCLASSCHAPTER = "http://imoocnote.calfnote.com/inter/getClassChapter.php",
        GETCLASSNOTE = "http://imoocnote.calfnote.com/inter/getClassNote.php";

    //给ajax做一个全局的错误处理
    $.ajaxSetup({
        error: function(){
            alert('调用接口失败');
            return false;
        }
    });

    function refreshClasses(curPage){
    	$.getJSON(GETCLASSES, {curPage: curPage}, function(data){
    		$('.classes').handlebars($('#class-tpl'), data.data);
    		$('.pag').handlebars($('#page-tpl'), formatPag(data.curPage, data.totalCount));
    	});
    }
    refreshClasses();

    function showNote(show) {
        show ? $('.overlap').show().next('.notedetail').show() : $('.overlap').hide().next('.notedetail').hide();
    }

    $('.pag').on('click', 'li.clickable', function(){
    	refreshClasses($(this).data('id'));
    });

    $('.overlap').on('click', function(){
        showNote(false);
    });

   	$('.classes').on('click', 'li', function(){
   		var cid = $(this).data('id');
   		//通过$.when当两个ajax请求都返回成功的时候做一个统一的回调处理
   		$.when(
   			$.getJSON(GETCLASSCHAPTER, {cid: cid}),
   		 	$.getJSON(GETCLASSNOTE, {cid: cid})
   		).done(function (cData, nData){
   			$('.notedetail .chapterdiv').handlebars($('#chapter-tpl'), cData[0]);
   			$('.notedetail .notediv').handlebars($('#note-tpl'), nData[0]);
   			console.log(nData);
           	showNote(true);
        });
   	});

    Handlebars.registerHelper('equal', function(v1, v2, options){
    	return v1 == v2 ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('long', function(v, options){
    	return ~v.indexOf('小时') ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('addone', function(v){
    	return v + 1;
    });

    Handlebars.registerHelper("formatDate", function(v) {
        if(!v) return '';
        var d = new Date(v);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var date = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        var str = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        return str;
    });

    /**
     * 构建分页逻辑所需要的数据
     * registerHelper的使用原则：不要在里面拼接大段的HTML代码。
     * 类似本利中的分页组件，最好是构造一份适合Handlebars的数据，然后传给它，来生成html。
     */
    function formatPag(cur, total) {
        var arr = [],cur = parseInt(cur),total = parseInt(total);
        // 处理首页的逻辑：<<
        var toLeft = {};
        toLeft.index = 1; // index代表点击按钮的时候可以跳转到的页面
        toLeft.text = '&laquo;'; // text代表button的文本

        if(cur != 1) toLeft.clickable = true;
        arr.push(toLeft);

        // 处理到上一页的逻辑
        var pre = {};
        pre.index = cur - 1;
        pre.text = '&lsaquo;';

        if(cur != 1) pre.clickable = true;
        arr.push(pre);

        // 处理到cur页前的逻辑
        if(cur <= 5){
            for(var i = 1; i < cur; i++){
                var pag = {};
                pag.text = i;
                pag.index = i;
                pag.clickable = true;
                arr.push(pag);
            }
        }else{
            //如果cur>5，那么cur前的页要显示为...
            var pag = {};
            pag.text = 1;
            pag.index = 1;
            pag.clickable = true;
            arr.push(pag);
            var pag = {};
            pag.text = '...';
            arr.push(pag);
            // 当前页前面2个页数显示出来
            for(var i = cur - 2; i < cur; i++){
                var pag = {};
                pag.text = i;
                pag.index = i;
                pag.clickable = true;
                arr.push(pag);
            }
        }

        // 处理当前页
        var pag = {};
        pag.text = cur;
        pag.index = cur;
        pag.cur = true;
        arr.push(pag);

        // 处理cur页后的逻辑
        if (cur >= total - 4) {
            for (var i = cur + 1; i <= total; i++) {
                var pag = {};
                pag.text = i;
                pag.index = i;
                pag.clickable = true;
                arr.push(pag);
            }
        } else {
            // 如果cur < total - 4, 那么cur后的页面显示为...
            // 显示以当前页后面的2个页数
            for (var i = cur + 1; i <= cur + 2; i++) {
                var pag = {};
                pag.text = i;
                pag.index = i;
                pag.clickable = true;
                arr.push(pag);
            }
            var pag = {};
            pag.text = '...';
            arr.push(pag);
            var pag = {};
            pag.text = total;
            pag.index = total;
            pag.clickable = true;
            arr.push(pag);
        }

        // 处理到下一页的逻辑
        var next = {};
        next.index = cur + 1;
        next.text = '&rsaquo;';
        if(cur != total) next.clickable = true;
        arr.push(next);

        // 处理到尾页的逻辑
        var toRight = {};
        toRight.index = total; // index代表点击按钮的时候可以跳转到的页面
        toRight.text = '&raquo;'; // text代表button的文本
        if(cur != total) toRight.clickable = true;
        arr.push(toRight);
        return arr;
    }

});