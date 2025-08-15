// ######################################
// ### ”правление избранным и так далее ###
// ######################################

var $int, $last;
// массив $n задан php-частью.
var $temp, $t2;

var $x, $obj, $controls, $id, $note;

// ############
// ### AJAX ###
// ############

function pick($id, $icon)
{
	makeRequest('/users/jsentry.php', 'pick', 'id='+$id+'&icon='+$icon);
	disableControls($id);
}
function toggleControls($id, $target)
{
	var $obj=document.getElementById('c'+$id);
	for ($x in $obj.children)
	{
		if ($target) $obj.children[$x].onclick=function()
			{
				return false;
			}
		else $obj.children[$x].onclick=function()
			{
				return true;
			}
	}
}
function disableControls($id)
{
	toggleControls($id, true);
}
function enableControls($id)
{
	toggleControls($id, false);
}

function fcd($obj, $tag)
{
try
  {
  return $obj.getElementsByTagName($tag)[0].firstChild.data;
  } catch(e)
    {
    return '';
    }
}

function parse_received($msg, $method)
{
	if ($method=='pick')
	{
		var $error=fcd($msg, 'error');
		if (!$error)
		{
			var $id=fcd($msg, 'id'), $pick=fcd($msg, 'pick');
			var $obj=document.getElementById('v'+$id+$pick);
			$obj.style.fontWeight='bold';
			var $val=parseInt($obj.innerHTML)+1;
			$obj.innerHTML=$val;
			$obj=document.getElementById('s'+$id+$pick);
			$obj.style.opacity='1';
			$pick=fcd($msg, 'reduce');
			if ($pick!='')
			{
				$obj=document.getElementById('v'+$id+$pick);
				$obj.style.fontWeight='normal';
				$val=parseInt($obj.innerHTML)-1;
				$obj.innerHTML=$val;
				if ($val<1)
				{
					$obj=document.getElementById('s'+$id+$pick);
					$obj.style.opacity='0.5';
				}
			}
			$val=10;
		}
		else
		{
			alert('ќшибка: '+$error);
		}
		var $enable=fcd($msg, 'enable');
		if ($enable)
		{
			var $id=fcd($msg, 'id');
			enableControls($id);
		}
	}
}