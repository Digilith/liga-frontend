function youSure($link)
{
	if (confirm('Вы уверены?')) window.location.href=$link;
}

function Show(id)
{
	itm=document.getElementById(id);
	itm.style.display = "";
}
function Hide(id)
{
	itm=document.getElementById(id);
	itm.style.display = "none";
}
function ShowInline(id)
{
	itm=document.getElementById(id);
	itm.style.display = "inline";
}

function ShowHide(id1, id2)
{
	var $cookie;
	if (typeof(arguments[2])!='undefined') $cookie=arguments[2]; else $cookie=null;
	Hide (id2);
	Show (id1);
	if ($cookie)
	{
		var $name='expand_'+$cookie;
		if (id2==$cookie) createCookie($name, 'no')
		else eraseCookie($name);
	}
}
function InlineHide(id1, id2)
{
	var $cookie;
	if (typeof(arguments[2])!='undefined') $cookie=arguments[2]; else $cookie=null;
	Hide (id2);
	ShowInline (id1);
	if ($cookie)
	{
		var $name='expand_'+$cookie;
		if (id2==$cookie) createCookie($name, 'no')
		else eraseCookie($name);
	}
}
/* function ShowHideHide(id1, id2, id3)
{
	Hide (id2);
	Hide (id3);
	Show (id1);
}
function ShowShowHide(id1, id2, id3)
{
	Hide (id3);
	Show (id1);
	Show (id2);
} */

function sendComment()
{
	var $sec=escape(document.commentform.section.value);
	var $part=escape(document.commentform.partid.value);
    var $comm=escape(document.commentform.mycomment.value).replace(/\+/g, '%2B');
	document.commentform.mycomment.value='';
	makeRequest('//pokeliga.com/comments2.php', 'send_chat', 'section='+$sec+'&partid='+$part+'&mycomment='+$comm);
}

function tagSelected($obj)
{
	var $index=$obj.selectedIndex;
	if ($index>0)
	{
		var $target;
		if (typeof(arguments[1])!='undefined') $target=arguments[1]; else $target='tags';
		var $tags=document.getElementById($target);
		if ($tags.value!='') $tags.value+=', ';
		$tags.value+=$obj.options[$index].value;
	}
}

function tri($n)
{
	if ($n<10) return '00'+$n;
	else if ($n<100) return '0'+$n;
	else return $n;
}
function quad($n)
{
	if ($n<10) return '000'+$n;
	else if ($n<100) return '00'+$n;
	else if ($n<1000) return '0'+$n;
	else return $n;
}

function process_tags($tag, $value, $target)
{
	var $obj=document.getElementById($target);
	$obj.focus();
	$openTag = "[" + $tag + ($value === null ? '' : '=' + $value) + "]";
	$closeTag = "[/" + $tag + "]";
	if (navigator.appName=="Microsoft Internet Explorer")
	{
		document.selection.createRange().text = $openTag + document.selection.createRange().text + $closeTag;
	}
	else
	{
		$slstart = $obj.selectionStart;
		$slend = $obj.selectionEnd;
		$selection = $obj.value.substring($slstart, $slend);
		$obj.value = $obj.value.substr(0,$slstart) + $openTag + $selection + $closeTag + $obj.value.substr($slend);
	}
}

function insert_text($area, $text)
{
	var $obj=document.getElementById($area);
	$obj.focus();
	if (navigator.appName=="Microsoft Internet Explorer")
	{
		document.selection.createRange().text = $text;
	}
	else
	{
		$slstart = $obj.selectionStart;
		$slend = $obj.selectionEnd;
		$selection = $obj.value.substring($slstart, $slend);
		$obj.value = $obj.value.substr(0,$slstart) + $text + $obj.value.substr($slend);
	}
}

function insert_nick($nick)
{
	insert_text('mycomment', '[b]'+$nick+'[/b]');
}
function insert_comment($text)
{
	insert_text('mycomment', $text);
}

function changeText($id, $text)
{
	var $obj=document.getElementById($id);
	$obj.innerHTML=$text;
}

function addslashes($str) // Quote string with slashes
{
    return $str.replace(/[\x22\x27\x5C]/g, "\\$0").replace(/\0/g, "\\0");
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


function preventUnload(targetId)
{
	var listener = function (e) {
		var obj = document.getElementById(targetId);
		if (!(e && obj.value && obj.value.trim())) return;
		try {
			e.preventDefault();
		} catch (exc) {
			// do nothing
		}
		try {
			// Chrome requires returnValue to be set
			return e.returnValue = 'Возможно, внесенные изменения не сохранятся.';
		} catch (exc) {
			// do nothing
		}
	};

	window.addEventListener('beforeunload', listener, true);

	var forms = document.forms;
	for (var i = 0; i < forms.length; i++) {
		forms[i].addEventListener('submit', function (e) {
			window.removeEventListener('beforeunload', listener, true);
		});
	}
}

function preview(targetId, previewId, faq, advanced, img, pieces)
{
	var obj = document.getElementById(targetId);
	var text = escape(obj.value).replace(/\+/g, '%2B');
	if (!text) return;

	var request = new XMLHttpRequest();
	request.open('POST',  '//pokeliga.com/preview.php', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send('text=' + text + '&faq=' + faq + '&advanced=' + advanced + '&img=' +  img + '&pieces=' + pieces);

	request.onload = function () {
		document.getElementById(previewId).innerHTML = request.responseXML.getElementsByTagName('response')[0].firstChild.data;
	};
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

	var target;
	if (typeof(arguments[3])!='undefined') target=arguments[3];

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
	if (target)
	{
//		form.target2=target;
//		form.onsubmit="alert('123'); window.open('about:blank', this.target2, 'width=500,height=400,status=1');";
		form.setAttribute("target", target);
	}

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}

function check_html($id)
{
	var $obj=document.getElementById('enhtml');
	var $text=document.getElementById($id);
	if ($obj.checked) $text.enhtml=true;
	else $text.enhtml=false;
}

function fixWidth($width)
{
	var $obj=document.getElementById('nav');
	if (!$obj) return;
	$obj.style.minWidth=($width+136+140+100)+'px';
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-38801396-1']);
_gaq.push(['_setDomainName', 'pokeliga.com']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function addScript($src)
{
	var tag = document.createElement('script');
	tag.type = 'text/javascript';
	tag.src = $src;
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(tag, s);
}
