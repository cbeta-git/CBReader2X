var NoteType;	// orig:原書校註, cbeta:CBETA校註, none:無校註
var DisplayType;	// line:原書格式, para:段落格式
var CBCopy = new CiteCopy();
var YearQ = "2022.Q4";	// 引用複製的年份
var leftTopATagName;	// 畫面中左上角 A 標記的 name 屬性
var ShowCollationCF;	// 判斷要不要秀出校注的 cf 資料，由網頁內提供
//var FirstRun = false;	// 判斷是不是第一次執行
//var noword = "〔－〕";

// 前進至最後儲存的A標記位置
function gotoLeftTop()
{
	$("a[name='" + leftTopATagName + "']").each(function(){
		this.scrollIntoView();
		return false;
	});
}

// 取得畫面左上角A標記的name屬性
function getLeftTopATagName()
{
	$("a[name]").each(function() {
		var data = this.getBoundingClientRect();
		var y = data.top;
		if (y >= 0) {
			leftTopATagName = $(this).attr("name");
			return false;
		}
	});
}

// 原書格式
function ShowLine()
{
	if(DisplayType == "line") return;
	getLeftTopATagName();
	// 先還原 <br>
	$('span.lb_br').replaceWith(function(){
		let myhtml = this.outerHTML;
		myhtml = myhtml.replace(/^<span/,"<br");
		return myhtml;
	});

	$("p").css("margin-left","0em");
	$("ul").css("margin-left","0em");
	$("div").css("margin-left","0em");
	$("table").css("margin-left","0em");
	$("div").not("#div_notearea,#div_notearea_box,#div_toolbar,#CollationList").css("display","inline");
	$("#CollationList").css("display","none");	// 校註不要呈現
	$("p").css("display","inline");
	$("ul").css("display","inline");
	$("ul").css("padding-left","0px");
	$("li").css("display","inline");
	$("br.lb_br").css("display","inline");
	$("br.para_br").css("display","none");
	$("table").css("border-style","none");
	$("td").css("padding","0px");
	/*
	$("table").css("display","inline");
	$("table").css("line-height","2px");
	$("tbody").css("display","inline");
	$("tr").css("display","inline");
	$("td").css("display","inline");
	$("td").css("border-style","none");
	$("td").css("padding","0px");
	*/

	$(".linehead").css("display", $(".parahead").css("display"));

	$(".line_space").css("display","inline");
	$(".para_space").css("display","none");
	
	$(".parahead").css("display", "none");
	$("p.juannum").css("margin-left","0em");
	$("p.headname2").css("margin-left","0em");
	$("p.headname3").css("margin-left","0em");
	$("p.headname4").css("margin-left","0em");
	$("p.byline").css("margin-left","0em");
	
	// 最後把 <p> <div> 各標記 都換成 <span>
	Tag2Span("div");
	Tag2Span("p");
	Tag2Span("li");// 先 li 後 ul , 順序不可錯亂
	Tag2Span("ul");// 先 li 後 ul , 順序不可錯亂
	$('br.para_br').replaceWith(function(){
		let myhtml = this.outerHTML;
		myhtml = myhtml.replace(/^<br/,"<span");
		return myhtml;
	});
	Tag2Span("td");
	Tag2Span("tr");
	Tag2Span("tbody");
	Tag2Span("table");
	
	$("a.note_orig,a.note_mod,a.note_add,a.note_star,a.note_star_removed").attr("onclick","return ShowCollation($(this));");
	DisplayType = "line";
	gotoLeftTop();
}

// 將指定標記轉成 span
function Tag2Span(tagname)
{
	// table[data-tagname="table"]
	var tag = tagname + '[data-tagname="' + tagname + '"]';
	while($(tag).length>0)
	{
		$(tag).replaceWith(function(){
			let myhtml = this.outerHTML;
			var re1 = new RegExp("^<" + tagname);
			myhtml = myhtml.replace(re1,"<span");	// replace(/^<table/,"<span")
			var re2 = new RegExp("<\/" + tagname + ">$");
			myhtml = myhtml.replace(re2,"</span>");	// replace(/<\/table>$/,"</span>")
			return myhtml;
		});
	}
}

// 段落格式
function ShowPara()
{
	if(DisplayType == "para") return;
	getLeftTopATagName();
	// 先把 <span> 還原 <p> <div> ...等標記
	Span2Tag("ul");// 先 ul 後 li , 順序不可錯亂
	Span2Tag("li");// 先 ul 後 li , 順序不可錯亂

	$('span.para_br').replaceWith(function(){
		let myhtml = this.outerHTML;
		myhtml = myhtml.replace(/^<span/,"<br");
		return myhtml;
	});

	Span2Tag("td");
	Span2Tag("tr");
	Span2Tag("tbody");
	Span2Tag("table");
	Span2Tag("div");
	Span2Tag("p");
 
	$("p").each(function() {
		var mar = $(this).attr("data-margin-left");
		$(this).css("margin-left",mar);
	});
	$("ul").each(function() {
		var mar = $(this).attr("data-margin-left");
		$(this).css("margin-left",mar);
	});
	$("div").each(function() {
		var mar = $(this).attr("data-margin-left");
		$(this).css("margin-left",mar);
	});
	$("table").each(function() {
		var mar = $(this).attr("data-margin-left");
		$(this).css("margin-left",mar);
	});
	$("div").not("#div_notearea,#div_notearea_box,#div_toolbar,#CollationList").css("display","block");
	$("#CollationList").css("display","none");	// 校註不要呈現
	$("p").css("display","block");
	$("li").css("display","list-item");
	$("ul").css("display","block");
	$("ul").css("padding-left","40px");
	$("br.lb_br").css("display","none");
	$("br.para_br").css("display","inline");
	$("table").css("border-collapse","collapse");
	$("table").css("border-style","solid");
	$("td").css("padding","0.5em");
	$("td.pl-1").css("padding-left","1.5em");
	$("td.pl-2").css("padding-left","2.5em");
	$("td.pl-3").css("padding-left","3.5em");
	$("td.pl-4").css("padding-left","4.5em");
	$("td.pl-5").css("padding-left","5.5em");
	$("td.pl-6").css("padding-left","6.5em");
	$("td.pl-7").css("padding-left","7.5em");
	$("td.pl-8").css("padding-left","8.5em");
	
	/* 不用了
	$("table").css("display","table");
	$("table").css("line-height","20px");
	$("tbody").css("display","table-row-group");
	$("tr").css("display","table-row");
	$("td").css("display","table-cell");
	$("td").css("border-style","solid");
	$("td").css("padding","10px");
	*/
	
	$(".parahead").css("display", $(".linehead").css("display"));
	$("p.juannum").css("margin-left","2em");
	$("p.headname2").css("margin-left","2em");
	$("p.headname3").css("margin-left","3em");
	$("p.headname4").css("margin-left","4em");
	$("p.byline").css("text-align","right");

	$(".linehead").css("display", "none");
	$(".line_space").css("display", "none");
	$(".para_space").css("display","inline");
 
	$('br.lb_br').replaceWith(function(){
		let myhtml = this.outerHTML;
		myhtml = myhtml.replace(/^<br/,"<span");
		return myhtml;
	});
	
	$("a.note_orig,a.note_mod,a.note_add,a.note_star,a.note_star_removed").attr("onclick","return ShowCollation($(this));");
	DisplayType = "para";
	gotoLeftTop();
}

// 將 span 轉成指定標記
function Span2Tag(tagname)
{
	// span[data-tagname="table"]

	var tag = 'span[data-tagname="' + tagname + '"]';
	while($(tag).length>0)
	{
		$(tag).replaceWith(function(){
			let myhtml = this.outerHTML;
			myhtml = myhtml.replace(/^<span/,"<" + tagname);
			myhtml = myhtml.replace(/<\/span>$/,"</" + tagname + ">");
			return myhtml;
		});
	}
}

// 切換行首(段首)呈現
function ToggleLineHead()
{
	if($("br.lb_br").css("display") == "inline")
	{
		// 原書格式
		if($(".linehead").css("display") == "none")
			$(".linehead").css("display", "inline");
		else
			$(".linehead").css("display", "none");
		$(".pts_head").css("display", $(".linehead").css("display"));
	}
	else
	{
		// 段落格式
		if($(".parahead").css("display") == "none")
			$(".parahead").css("display", "inline");
		else
			$(".parahead").css("display", "none");
		$(".pts_head").css("display", $(".parahead").css("display"));
	}
}

// ------------------------------------------------------------------
// 無校註
function NoCollation()
{
	$(".note_orig").hide();
	$(".note_mod").hide();
	$(".note_add").hide();
	$(".note_star").hide();
	$(".note_star_removed").hide();
	$("#div_notearea_box").hide();
	NoteType = "none";
}
// 原書校註
function OrigCollation()
{
	$(".note_add").hide();
	$(".note_mod").hide();
	$(".note_orig").show();
	$(".note_star").show();
	$(".note_star_removed").show();
	//$("#div_notearea").show();
	//$("#div_notearea_box").show();

	$(".note_app").html(function (){
		$obj = $(this);
		return ShowSelectWord($obj,"orig");
	});
	$(".note_app .note_app").html(function (){
		$obj = $(this);
		return ShowSelectWord($obj,"orig");
	});
	NoteType = "orig";
}
// CBETA校註
function CBETACollation()
{
	$(".note_orig").hide();
	$(".note_mod").show();
	$(".note_add").show();
	$(".note_star").show();
	$(".note_star_removed").hide();
	//$("#div_notearea").show();
	//$("#div_notearea_box").show();
	
	$(".note_app").html(function (){
		$obj = $(this);
		return ShowSelectWord($obj,"lem");
	});
	$(".note_app .note_app").html(function (){
		$obj = $(this);
		return ShowSelectWord($obj,"lem");
	});
	NoteType = "cbeta";
}
// 呈現校註

function ShowCollation($obj)
{
	// 呈現校註
	// 同時呈現二組 
	// <span class=note_orig>..</span>
	// <span class=note_mod>..</span>
	// 如果沒有 mod , 則第一組就同時有二個 class
	var id = $obj.attr("id");

	$("#div_notearea_box").show();
	$("#div_notearea").html("");

	var type;
	if(id.indexOf("note_orig") >= 0) type = "orig";		// 原始校註
	else if(id.indexOf("note_mod") >= 0) type = "mod";	// CBETA 修訂校註
	else if(id.indexOf("note_add") >= 0) type = "add";	// CBETA 新增校註或修訂
	else if(id.indexOf("note_star") >= 0) type = "star";	// 星號校註

	if(type == "orig") {
		newid = "#txt_" + id;
		if($(newid).length > 0) {
			$("#div_notearea").append("<span class='note_orig'>" + $(newid).html() + "</span>");
		}
		newid = newid.replace("note_orig","note_mod");
		if($(newid).length > 0) {
			// 加上 note cf
			cfid = newid.replace("note_mod","note_app");
			cfid += ">div[type='cf']";
			note_cf = GetNoteCF(cfid);
			note_key = GetNoteKey(newid);
			$("#div_notearea").append("<span class='note_mod'>" + $(newid).html() + note_cf + note_key + "</span>");
		} else {
			$("#div_notearea span.note_orig").addClass("note_mod" );
		}

		$("#div_notearea .note_mod").hide();
		$("#div_notearea .note_orig").show();
	}
	else if(type == "mod") {
		newid = "#txt_" + id;
		if($(newid).length > 0) {
			// 加上 note cf
			cfid = newid.replace("note_mod","note_app");
			cfid += ">div[type='cf']";
			note_cf = GetNoteCF(cfid);

			// 檢查有沒有 note_key 屬性
			note_key = GetNoteKey(newid);

			$("#div_notearea").append("<span class='note_mod'>" + $(newid).html() + note_cf + note_key + "</span>");
		}
		newid = newid.replace("note_mod","note_orig");
		if($(newid).length > 0) {
			$("#div_notearea").append("<span class='note_orig'>" + $(newid).html() + "</span>");
		}

		$("#div_notearea .note_orig").hide();
		$("#div_notearea .note_mod").show();
	}
	else if(type == "add") {
		// 這才是現成的版本, 底下自行產生的版本先留著
		newid = "#txt_" + id;
		if($(newid).length > 0) {
			// 加上 note cf
			cfid = newid.replace("note_add","note_app");
			cfid += ">div[type='cf']";
			note_cf = GetNoteCF(cfid);
			
			// 檢查有沒有 note_key 屬性
			note_key = GetNoteKey(newid);

			$("#div_notearea").append("<span class='note_add'>" + $(newid).html() + note_cf + note_key + "</span>");
		}
		$("#div_notearea .note_add").show();

		/* 這是自行產生的版本, 要換成上面讀取現成的版本

		// 自訂的校註
		// 呈現 XX【CB】，XX【明】，〔－〕【磧砂】
		newid = "#txt_" + id.replace("note_add","note_app");

		txt = "<span class='note_add'>";
		// lem 內容
		//lemtxt = $(newid + " div[type='lem']").html();
		lemtxt = $(newid).find("div[type='lem']").html();
		if(lemtxt == "") lemtxt = noword;
		txt += lemtxt;
		txt += $(newid).find("div[type='lem']").attr("data-wit");

		// rdg 內容
		
		$(newid).find("div[type='rdg']").each(function(){
			txt += "，";
			rdgtxt = $(this).html();
			if(rdgtxt == "") rdgtxt = noword;
			txt += rdgtxt;
			txt += $(this).attr("data-wit");
		})

		txt += "</span>";

		$("#div_notearea").html(txt);
		*/

	}
	else if(type == "star") {
		newid = "#txt_" + id;	// #txt_note_star_0001002-1
		newid = newid.replace(/\-\d+/,"");	// #txt_note_star_0001002
		newid = newid.replace("note_star","note_orig");
		if($(newid).length > 0) {
			$("#div_notearea").append("<span class='note_orig'>" + $(newid).html() + "</span>");
		}
		newid = newid.replace("note_orig","note_mod");
		if($(newid).length > 0) {
			// 加上 note cf
			cfid = newid.replace("note_mod","note_app");
			cfid += ">div[type='cf']";
			note_cf = GetNoteCF(cfid);
			note_key = GetNoteKey(newid);
			$("#div_notearea").append("<span class='note_mod'>" + $(newid).html() + note_cf + note_key + "</span>");
		} else {
			$("#div_notearea span.note_orig").addClass("note_mod");
		}

		newid = newid.replace("#txt_","#");
		newid = newid.replace("note_mod","note_orig");
		if($(newid).length > 0)
		{
			if($(newid).css("display") == "inline") {	// 目前呈現 orig
				$("#div_notearea .note_mod").hide();
				$("#div_notearea .note_orig").show();
			}
			else {
				$("#div_notearea .note_orig").hide();
				$("#div_notearea .note_mod").show();
			}
		}
	}

	// 把校註中的段首 [xxxxpxx] 移除
	var note_area_html = $("#div_notearea").html();
	// <span class='parahead' style='display:none'>[0001a05] </span>
	note_area_html = note_area_html.replace(/<span[^>]*class=['"]parahead['"].*?<\/span>/g,"");
	note_area_html = note_area_html.replace(/<br [^>]*><a [^>]*><\/a><span[^>]*class=['"]linehead['"].*?<\/span>/g,"");
	$("#div_notearea").html(note_area_html);

	// 塗色
	$obj.focus(function() {
		let newid = '#' + $(this).attr('id');
		newid = newid.replace(/mod|orig|add|star/,"app");
		$(this).css("background-color",'lightpink');
		$(newid).css("background-color",'lightpink');
	});
	$obj.focusout(function() {
		let newid = '#' + $(this).attr('id');
		newid = newid.replace(/mod|orig|add|star/,"app");
		$(this).css("background-color",'');
		$(newid).css("background-color",'');
	});

	$obj.focus();
	return false;
}
// 取得 note cf 文字
function GetNoteCF(cfid)
{
	note_cf = "";			
	if($(cfid).length > 0) {
		note_cf = "<span class='note_cf'>(cf. " + $(cfid).html() + ")</span>";
	}
	return note_cf;
}

// 取得連結校注考證資料庫
function GetNoteKey(id)
{
	note_key = $(id).attr("note_key");
	if (note_key != undefined) {
		if (window.navigator.userAgent.indexOf("Mac") != -1) {
				// Mac 版
				// note_key = "<br><a href='https://www.cbeta.org/revised_research.php?notekey=" + note_key + "' target='_blank'>CBETA 校訂考證資料庫</a>";
				note_key = "<br><a href='' onclick=\"window.webkit.messageHandlers.openNoteKey.postMessage('https://www.cbeta.org/revised_research.php?notekey=" + note_key + "');return false;\">CBETA 校訂考證資料庫</a>";
			} else {
				// Windows 版
				// note_key = "<br><a href='' target='_blank' onclick='var active = new ActiveXObject(\"WScript.Shell\");activeX = active.Run(\"https://www.cbeta.org/revised_research.php?notekey=" + note_key + "\");return false;'>CBETA 校訂考證資料庫</a>";
				note_key = "<br><a href='' onclick=\"window.external.openNoteKey('https://www.cbeta.org/revised_research.php?notekey=" + note_key + "');return false;\">CBETA 校訂考證資料庫</a>";
		}
		return note_key;
	}
	return "";
}

// 選擇用字
function ShowSelectWord($obj,type)
{
	var id = $obj.attr("id");
	var newid = "#txt_" + id + " > div[type='" + type + "']";
	var txt = $(newid).html();
	return txt;
}
// ------------------------------------------------------------------
// 缺字呈現組字式
function GaijiShowDes($obj)
{
	$(".gaiji[data-des]").html(function(){
		return $(this).attr("data-des");
	});
}
// 缺字呈現通用字
function GaijiShowNormal($obj)
{
	$(".gaiji[data-nor]").html(function(){
		return $(this).attr("data-nor");
	});
}
// 缺字呈現組字式
function GaijiShowUnicode($obj)
{
	$(".gaiji[data-uni]").html(function(){
		return $(this).attr("data-uni");
	});
}
// 缺字呈現圖檔
function GaijiShowPic($obj)
{
	$(".gaiji[data-imgfile]").html(function(){
		imgurl = $(this).attr("data-imgfile");
		return "<img src=\"" + imgurl + "\"/>";
	});
}
// ------------------------------------------------------------------
// 切換上方選單的收放
function MenuToggle()
{
	if($("input.menuitem").css("display") == "none")
	{
		$("input.menuitem").show();
		$("input#menutogg").val("▸");
	}
	else
	{
		$("input.menuitem").hide();
		$("input#menutogg").val("◂");
	}
}
// 關閉校註區
function div_note_close()
{
	$("#div_notearea_box").hide();
}

// 一般複製
function NormalCopy()
{
	document.execCommand('copy');
}

// 引用複製物件
function CiteCopy()
{
	var IE = (/msie/.test(navigator.userAgent.toLowerCase())) ? true : false;	//IE9,10
	var IE11 = (/trident/.test(navigator.userAgent.toLowerCase()) ? true:false);	//IE11
	var edge = (/edge/.test(navigator.userAgent.toLowerCase()) ? true:false);	//edge
	var clip_div = $("<div id='clip_div'></div>");
	var range;
	var selection;
	var select_from_star;	// 判斷引用複製是不是由行首開始

	// 取得選取的 range
	function _get_range()	
	{
		if(IE) 
		{
			selection = document.selection;
			range = selection.createRange();
			if(range.text == '') {
				//throw "請選擇文章內的文字後再使用引用複製功能。\n Please markup the text first.";
				alert("請選擇文章內的文字後再使用引用複製功能。\n Please markup the text first.");
				return false;
			}
		}
		else 
		{
			selection = document.getSelection();
			if(selection.toString() == '') {
				//throw "請選擇文章內的文字後再使用引用複製功能。\n Please markup the text first.";
				alert("請選擇文章內的文字後再使用引用複製功能。\n Please markup the text first.");
				return false;
			}
			range = selection.getRangeAt(0);
		}
		return true;
	}

	// 取得標準行首資訊
	function _get_linedata()
	{
		var line_begin,line_end;
		// IE 版做法
		if(IE || IE11 || edge)
		{	
			var rangeHTML = (IE ? range.htmlText:range.cloneContents());
			clip_div.html(rangeHTML);	
			var clip_div_html = clip_div.html();
			
			// 判斷選取是不是從行首開始
			// <a name="p0001a01">
			select_from_star = false;
			while(clip_div_html.length>0)
			{
				// 遇到 <a name="p0001a01"> 就表示從行首開始
				if(clip_div_html.search(/^<a name=['"]p.\d\d\d\D\d\d['"]/)>=0)
				{
					select_from_star = true;
					break;
				}
				// 遇到 <span class="linehead"> 就表示從行首開始
				if(clip_div_html.search(/^<span class=['"]linehead['"]>/)>=0)
				{
					select_from_star = true;
					break;
				}
				// 有時行首會有 <span ....> 只要是標記, 就先濾掉
				if(clip_div_html.search(/^<.*?>/)>=0)
				{
					clip_div_html = clip_div_html.replace(/^<.*?>/,"");
				}
				else
				{
					break;
				}
			}

			var Is_find_first_line = false;
			// 尋找選擇範圍的行首資訊
			$('span.linehead').each(function (i) {
				var sourceRange = document.createRange();
				sourceRange.selectNode(this);
				compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
				compare2 = range.compareBoundaryPoints(Range.END_TO_END, sourceRange);
				if(compare == 1) line_begin = $(this);
				else if(compare <= 0)
				{
					// 若是由行首開始, 則開始的位置不是前一行, 而是當下這一行
					if(select_from_star == true && Is_find_first_line == false) 
					{
						line_begin = $(this);
						Is_find_first_line = true;	// 找到第一筆, 之後就不用再找了
					}
				}
				if(compare2 == 1) line_end = $(this);
				else if(compare2 <= 0) return false;
			});
			return [line_begin.html(),line_end.html()];
		}
		else
		{
			// 非 IE 版的做法
			$('span.linehead').each(function (i) {
				var compareValue = range.comparePoint(this, 0);
				if (compareValue==-1) 
				{
					line_begin = $(this);
					line_end = $(this);
				} 
				else if (compareValue==0) 
					line_end = $(this);
				else if (compareValue==1) return false;
			});				
			return [line_begin.html(),line_end.html()];
		}
	}	
	
	// 取得選取文字
	function _get_select_htm()	
	{
		var text = (IE ? range.htmlText:range.cloneContents());
		var div = $('<div/>');
		div.html(text);

		// 移除行首
		div.find("span.linehead").remove();
		div.find("span.parahead").remove();
		div.find("span.pts_head").remove();

		// 移除校註符號
		if(NoteType == "none")
		{
			div.find("a.note_orig").remove();
			div.find("a.note_mod").remove();
			div.find("a.note_add").remove();
			div.find("a.note_star").remove();
			div.find("a.note_star_removed").remove();
		}
		else if(NoteType == "cbeta")
		{
			div.find("a.note_orig").not("a.note_mod").remove();
			//div.find("a.note_mod").remove();
			//div.find("a.note_add").remove();
			//div.find("a.note_star").remove();
			div.find("a.note_star_removed").remove();
		}
		else if(NoteType == "orig")
		{
			//div.find("a.note_orig").remove();
			div.find("a.note_mod").not("a.note_orig").remove();
			div.find("a.note_add").remove();
			//div.find("a.note_star").remove();
			//div.find("a.note_star_removed").remove();
		}

		// 處理換行
		if($("br.lb_br").css("display") == "inline")
		{
			div.find("br.lb_br").html("\n");
		}
		if($("br.para_br").css("display") == "inline")
		{
			div.find("br.para_br").html("\n");
		}
		div.find("br").not("br.lb_br").not("br.para_br").html("\n");
		if($("p").css("display") == "block")
		{
			div.find("p").prepend("\n");
			div.find("div").prepend("\n");
		}

		// 移除不必要的空格
		div.find("span").each(function() {
			if($(this).css("display") == "none")
				$(this).html("");
		});

		// <img src='D:\temp\CBReader2X\Bookcase\CBETA\figures\Y\Y05p0181_01.gif'>
		div.find("img").prepend("【圖】");
		// 悉曇 <font face='siddam'>, 蘭札 <font face='Ranjana'>
		div.find("font[face='siddam']").html("◇");
		div.find("font[face='Ranjana']").html("◇");
		return div;
	}

	// 由選擇的 html 取出校註內容
	function _get_note_text(select_htm)
	{
		// 取出所有的校註
		// <a id="note_orig_0001005" class="note_orig" href="" 
		//    onclick="return false;">[5]</a>
		var note_list = select_htm.find('a.note_orig, a.note_mod, a.note_add, a.note_star, a.note_star_removed');
		var text = "";	// 校註內容
		var num = "";	// [01] , [＊4-1]
		var note_text = "";	// 全部校註
		note_list.each(function() {
			var id = $(this).attr('id');
			var cls = $(this).attr('class');
			if(cls == 'note_star' || cls == 'note_star_removed') {
				// 星號處理法
				// <a id="note_star_0001004-1" class="note_star" href="" onclick="return false;">[＊]</a>
				// <a id="note_orig_0001004" class="note_orig" href="" onclick="return false;">[4]</a>
				// <a id="note_mod_0001004" class="note_mod" href="" onclick="return false;">[4]</a>

				var pos = id.indexOf('-');
				var newid = "#txt_" + id.substr(0,pos);	// "note_star_0001004"
				var id_num = id.substr(14);		// "004-1"
				id_num = id_num.replace(/^0*/,"");	// 去除前面的 0
				num = "[＊" + id_num + "]";	// [＊4-1]

				if(NoteType == "orig") {
					newid = newid.replace(/_star_/,"_orig_");	// "note_orig_0001004"
					text = $(newid).html();
				} else if(NoteType == "cbeta") {
					newid = newid.replace(/_star_/,"_mod_");	// "note_mod_0001004"
					cfid = newid.replace("_mod_","_app_");
					// 如果沒有校註, 可能是沒有 mod , 換成 orig 試試
					if($(newid).length == 0) {
						newid = newid.replace(/_mod_/,"_orig_"); // "note_orig_0001004"
					}
					text = $(newid).html();

					// 判斷是否加上 note cf
					if(ShowCollationCF) {
						cfid += ">div[type='cf']";
						note_cf = GetNoteCF(cfid);
						text += note_cf;
					}
				}
			} else {
				var newid = "#txt_" + id;
				num = $(this).text();
				text = $(newid).html();

				if(NoteType == "cbeta") {
					// 判斷是否加上 note cf
					if(ShowCollationCF) {
						cfid = newid.replace(/_mod_|_add_/,"_app_");
						cfid += ">div[type='cf']";
						note_cf = GetNoteCF(cfid);
						text += note_cf;
					}
				}
			}
			if(text.slice(-1) != "。") {
				text += "。";
			}
			text += "　";
			note_text = note_text + num + " " + text;
		});

		note_text = note_text.replace(/<font face=['"]siddam['"]>.*?<\/font>/g,"◇");
		note_text = note_text.replace(/<font face=['"]Ranjana['"]>.*?<\/font>/g,"◇"); 
		note_text = note_text.replace(/<img .*?>/g,"【圖】");// 移除標記
		note_text = note_text.replace(/<.*?>/g,""); // 移除標記

		// xml 有 &amp; &lt;, 轉成 html 預設是 & < , CBR 程式讓 html 依然保持 &amp; &lt;
		// 實際呈現會自動轉成 & <, 但引用複製需要處理校註的部份
		// 所以只有 note_text 要處理 &amp; &lt; , text 不用處理
		
		note_text = note_text.replace(/&amp;/g,"&");
		note_text = note_text.replace(/&lt;/g,"<");
		return note_text;
	}

	//將cbeta經號轉換成 T01n0001_p0001a10 取出各組
	function _parser_linehead(linehead)	
	{	
		var reg = /([A-Z]+\d{2,3})n([AB]?\d{3,4}[a-z]?)_?p([a-z]?\d{3,4})([a-z])(\d\d)/gi.exec(linehead);
		if(!reg) return false;
		return {vol:reg[1],sutra:reg[2],page:reg[3],col:reg[4],line:reg[5]};
	}

	// 把二行資料合成一行
	// T01, no. 1, p. 1b24
	// T01, no. 1, p. 1b24-25
	// T01, no. 1, p. 1b29-c1
	// T01, no. 1, pp. 1c26-2a3
	function _get_line_str(line_begin, line_end)
	{
		line_begin = _move_zero(line_begin);
		line_end = _move_zero(line_end);

		var result = line_begin.vol + ", no. " + line_begin.sutra + ", ";
		result = result + _page_col_line_to_str(line_begin, line_end);
		return result;
	}

	// 移除前面的 0
	function _move_zero(line_data)
	{
		line_data.vol = line_data.vol.replace(/^0*/,"");	// R 版使用, 一般用不到
		line_data.sutra = line_data.sutra.replace(/^0*/,"");	// 一般版本, R版用不到
		line_data.page = line_data.page.replace(/^0*/,"");
		line_data.line = line_data.line.replace(/^0*/,"");
		if(line_data.page == "") line_data.page = 0;
		if(line_data.line == "") line_data.line = 0;
		return line_data;
	}

	// 取得 PTS 資訊
	function _get_ptsdata()
	{
		var line_begin = 0;
		var line_end = 0;
		var rangeHTML = (IE ? range.htmlText:range.cloneContents());
		clip_div.html(rangeHTML);

		// 尋找選擇範圍的行首資訊
		$('span.pts_head').each(function (i) {
			var sourceRange = document.createRange();
			sourceRange.selectNode(this);
			compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
			compare2 = range.compareBoundaryPoints(Range.END_TO_END, sourceRange);
			if(compare == 1) line_begin = $(this);
			else if(line_begin == 0) line_begin = $(this);	// 找不到起始, 就用這一組
			if(compare2 == 1) line_end = $(this);
			else if(compare2 <= 0)
			{
				if(line_end == 0) line_end = $(this); // 找不到結尾, 就用這一組
				return false;	
			}
		});
		return [line_begin.attr("title"),line_end.attr("title")];
	}

	//將 R 版 R110p0834a01 取出各組
	function _parser_R_linehead(xr_data)	
	{	
		var reg = /R(\d{1,3})p(\d{4})([ab])(\d\d)/gi.exec(xr_data[0]);
		if(!reg) return false;
		var xr_line_begin = {vol:reg[1],sutra:"",page:reg[2],col:reg[3],line:reg[4]};

		reg = /R(\d{1,3})p(\d{4})([ab])(\d\d)/gi.exec(xr_data[1]);
		if(!reg) return false;
		var xr_line_end = {vol:reg[1],sutra:"",page:reg[2],col:reg[3],line:reg[4]};

		return [xr_line_begin,xr_line_end];
	}

	// 將 pts 資料組成呈現的字串
	function _get_pts_str(ptsdata)
	{
		var result = " // " + ptsdata[0];
		if(ptsdata[0] != ptsdata[1]) result += " - " + ptsdata[1];
		return (result);
	}

	// 取得 R 版資訊
	function _get_xr_data()
	{
		var line_begin = 0;
		var line_end = 0;
		// var rangeHTML = (IE ? range.htmlText:range.cloneContents());
		// clip_div.html(rangeHTML);

		if($('span.xr_head').length == 0) return "";
		// 尋找選擇範圍的行首資訊
		$('span.xr_head').each(function (i) {
			var sourceRange = document.createRange();
			sourceRange.selectNode(this);
			compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
			compare2 = range.compareBoundaryPoints(Range.END_TO_END, sourceRange);
			if(compare == 1) line_begin = $(this);
			else if(line_begin == 0) line_begin = $(this);	// 找不到起始, 就用這一組
			if(compare2 == 1) line_end = $(this);
			else if(compare2 <= 0)
			{
				if(line_end == 0) line_end = $(this); // 找不到結尾, 就用這一組
				return false;	
			}
		});
		return [line_begin.attr("data-linehead"),line_end.attr("data-linehead")];
	}

	// 將 R, Z 資料組成呈現的字串
	function _get_xzr_str(xr_line)
	{
		// R 版資料
		var xr_line_begin = _move_zero(xr_line[0]);
		var xr_line_end = _move_zero(xr_line[1]);

		// 計算 Z 版
		var xz_line_begin = _r_to_z(xr_line_begin);
		var xz_line_end = _r_to_z(xr_line_end);

		// 處理 z 版結果
		var xr_result = _page_col_line_to_str(xr_line_begin, xr_line_end);
		var xz_result = _page_col_line_to_str(xz_line_begin, xz_line_end);

		// Z 1:1, p. 348, d3-11 // R1, p. 696, b3-11
		var result = " // Z " + xz_line_begin.book + ":" + xz_line_begin.vol + ", " + xz_result + " // R" + xr_line_begin.vol + ", " + xr_result;

		return result;
	}
	
	// 傳入二組頁欄行, 傳回組合結果
	// p. 73a3-4		跨行
	// p. 73a3-b4		跨欄
	// pp. 73a3-74b4	跨頁
	function _page_col_line_to_str(line_begin,line_end)
	{
		var result = "";
		var result_tail = "";

		// 頁
		if(line_begin.page != line_end.page)
		{
			result = "pp. " + line_begin.page;
			result_tail = line_end.page;
		}
		else
		{
			result = "p. " + line_begin.page;
		}

		// 欄
		result = result + line_begin.col;
		if(line_begin.col != line_end.col || result_tail != "")
			result_tail = result_tail + line_end.col;
		
		// 行
		result = result + line_begin.line;
		if(line_begin.line != line_end.line || result_tail != "")
			result_tail = result_tail + line_end.line;

		if(result_tail != "")
			result = result + "-" + result_tail;

		return result;		
	}

	// R 版轉 Z 版
	function _r_to_z(xr_line)
	{
		var xz_line = {book:"",vol:0,sutra:"",page:0,col:"",line:0};
		// 冊
		if (xr_line.vol <= 95) 
		{
			xz_line.book = "1";
			xz_line['vol'] = xr_line.vol;
		}
		else if (xr_line.vol <= 127) 
		{
			xz_line['book'] = "2";
			xz_line['vol'] = xr_line.vol - 95;
		}
		else
		{
			xz_line['book'] = "2B";
			xz_line['vol'] = xr_line.vol - 127;
		}

		// 頁
		rest = xr_line.page % 2;	// 餘
		xz_line['page'] = Math.floor((xr_line.page/2)) + rest;

		// 欄
		xz_line['col'] = xr_line.col;
		if (rest == 0) 
		{
			if (xr_line.col == 'a') xz_line['col'] = 'c';
			else xz_line['col'] = 'd';
		}
		// 行
		xz_line['line'] = xr_line.line;
		return xz_line;
	}

	// 取得經名與卷數
	function _get_titla()
	{
		var title = $("body").attr("data-sutraname");
		title = title.replace(/\(第.*?卷\)$/,"");
		title = "《" + title + "》";
		if($("body").attr("data-totaljuan")>1)
		{
			title += "卷" + $("body").attr("data-juan");
		}
		return title;
	}

	// 做出隱藏的文字區域
	function _create_clip_area() 
	{
		var clip_area = $('<textarea id="clip_area"></textarea>');
		clip_area.css('position','fixed');
		clip_area.css('top','0');
		clip_area.css('left','-110px');
		clip_area.width('100px');	// 長寬不能為 1 這種太小數字, 否則在 mac safari 無法引用複製
		clip_area.height('100px');
		clip_area.css('padding',0);
		// 移除框線
        clip_area.css('border','none');
        clip_area.css('outline','none');
        clip_area.css('boxShadow','none');
        // 透明
		clip_area.css('background','transparent');
		return clip_area;
	}

	// 將傳入文字複製至剪貼簿
	function _copy(copytext) 
	{
		// 做出隱藏文字區域
		clip_area = _create_clip_area();
		
		$("body").append(clip_area);

		clip_area.text(copytext);
		clip_area.select();
		document.execCommand('copy');

		// 還原選擇區 , IE 舊版大概不支援
		selection.removeAllRanges();
		selection.addRange(range);

		clip_area.remove();	// 若先移除 textarea , IE 重新設置選擇區會有問題
	}

	// 引用複製
	this.go = function()
	{
		if(_get_range() == false) {
			return;
		}

		var select_htm = _get_select_htm();
		var text = select_htm.text();
		// xml 有 &amp; &lt;, 轉成 html 預設是 & < , CBR 程式讓 html 依然保持 &amp; &lt;
		// 實際呈現會自動轉成 & <, 但引用複製需要處理校註的部份
		// 所以只有 note_text 要處理 &amp; &lt; , text 不用處理
		var note_text = _get_note_text(select_htm);
		// 取得標準行首資訊
		var linedata = _get_linedata();
		var line_begin = _parser_linehead(linedata[0]);
		var line_end = _parser_linehead(linedata[1]);
		var line_str = _get_line_str(line_begin, line_end);
		// 處理 PTS 資訊
		var pts_str = "";
		if($("span.linehead:first").html().substr(0,1) == "N")
		{
			var ptsdata = _get_ptsdata();
			pts_str = _get_pts_str(ptsdata);
		}
		// 處理卍續藏資訊
		var xzr_str = "";
		if($("span.linehead:first").html().substr(0,1) == "X")
		{
			var xr_data = _get_xr_data();
			if(xr_data != "")	// 找不到 R 版標記
			{
				var xr_line = _parser_R_linehead(xr_data);
				xzr_str = _get_xzr_str(xr_line);
			}
		}
		var title = _get_titla();
		var result = title + "：「" + text + "」(CBETA " + YearQ + ", " + line_str + xzr_str + pts_str + ")\n" + note_text;
		_copy(result);
	};
}

// 調整校註區大小
function update_notearea()
{
	var win_width = $(window).width();
	if(win_width < 695)
	{
		$("#div_notearea").width(win_width - 95);
		$("#div_notearea_box").width(win_width - 40);
	}
	else
	{
		$("#div_notearea").width(600);
		$("#div_notearea_box").width(655);
	}
}

// 初始畫面
$(document).ready(function(){
	// 上方功能列
	$tool_div = "<div id=\"div_toolbar\"  align=\"right\" style=\"position:fixed; border:1px; margin:10px; padding:5px; background-color:#57adad; writing-mode: lr-tb; right:0px; top:30px;\">\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"行\" title=\"原書格式呈現\"  onclick=\"ShowLine()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"段\" title=\"段落格式呈現\" onclick=\"ShowPara()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"行首\" title=\"行首顯示切換\" onclick=\"ToggleLineHead()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"通\" title=\"缺字呈現通用字\" style=\"background-color:#ffe59b; margin-left:5px;\" onclick=\"GaijiShowNormal()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"Ｕ\" title=\"缺字呈現 Unicode\" style=\"background-color:#ffe59b;\" onclick=\"GaijiShowUnicode()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"組\" title=\"缺字呈現組字式\" style=\"background-color:#ffe59b;\" onclick=\"GaijiShowDes()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"圖\" title=\"缺字呈現圖檔\" style=\"background-color:#ffe59b; margin-right:5px;\" onclick=\"GaijiShowPic()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"無\" title=\"無校註\" onclick=\"NoCollation()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"原\" title=\"原書校註+原書用字\"  onclick=\"OrigCollation()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"CB\" title=\"CB校註+CB用字\"  onclick=\"CBETACollation()\"/>\n"
	+ "<input class=\"menuitem\" type=\"button\" value=\"複\" title=\"一般複製\" style=\"background-color:#ffe59b; margin-left:5px;\" onclick=\"NormalCopy()\"/>\n"
	+ "<input class=\"_menuitem\" type=\"button\" value=\"引\" title=\"引用複製\" style=\"background-color:#ffe59b;\" onclick=\"CBCopy.go()\"/>\n"
	+ "<input id=\"menutogg\" type=\"button\" value=\"◂\" title=\"功能列\" style=\"background-color:yellow;width:20px;text-align:center;padding:0px;\" onclick=\"MenuToggle()\"/>\n"
	+ "</div>";
	// 下方校註區
	$note_div = "<div id=\"div_notearea_box\" style=\"position:fixed; border:1px; margin:10px; padding:10px; background-color:rgb(31, 119, 29); right:0px; bottom:0px; width:655px; height:150px; writing-mode: lr-tb; display:none;\">"
	+ "<input type=\"button\" value=\"X\" style=\"background-color:#ff8585;\"  title=\"關閉\" onclick=\"div_note_close()\"/>\n"
	+ "<div id=\"div_notearea\" style=\"position:fixed; border:1px; margin:10px; padding:10px; background-color:#bedebd; right:2px; bottom:2px; width:600px; height:146px; overflow:auto;\"></div>\n"
	"</div>";

	$("body").prepend($tool_div);
	$("body").prepend($note_div);

	// 設定校註視窗大小
	update_notearea();
	$(window).resize(function() {
		update_notearea();
	});
	$("input.menuitem").hide();	// 先隱藏工具列

	NoteType = $("body").attr("data-notetype");	// 目前呈現校註
	if($("br.lb_br").css("display") == "inline")
		DisplayType = "line";	// 目前是原書模式
	else
		DisplayType = "para";	// 目前是段落模式

	// 設定校註按下會呈現的功能
	//$("a.note_orig,a.note_mod,a.note_add,a.note_star,a.note_star_removed").attr("onclick","return ShowCollation($(this));");

	// p , div 通通加上 data-tagname , 記錄原始的 tagname
	// 處理的方法是, 在原書模式, 全部標記轉成 <span>....</span>
	// 在段落模式, 利用 data-tagname 屬性還原標記
	// ... 這在程式中處理了

	// 設定物件的 display
	// 例如原本 <span class="linehead">xxx</span> 是看不到的
	// 但 copy 還是會有, 所以再次設定其為 hide , 才會真正無法 copy 到
	//SetupDisplay();	// 不需要了, CBReader 先處理了

	// 處理完之後, 才到指定位置才會準確
	//if(gotoline != "") location.href = gotoline;
});

// 設定物件的 display , 目前用不到了
// 例如原本 <span class="linehead">xxx</span> 是看不到的
// 但 copy 還是會有, 所以再次設定其為 hide , 才會真正無法 copy 到
/*
function SetupDisplay()
{
	// 先隱藏行首
	ToggleLineHead();
	ToggleLineHead();
	// 重新設定段落或原書格式
	if(DisplayType == "para") ShowPara();
	else ShowLine();
	
	// 重新設定校註的隱藏情況
	if(NoteType == "none") NoCollation();
	else if(NoteType == "cbeta") CBETACollation();
	else if(NoteType == "orig") OrigCollation();

	FirstRun = false;
}
*/