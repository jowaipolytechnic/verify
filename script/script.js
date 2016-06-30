//--------------AJAX call
function xhr(roll,number){
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function(){
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
      doProcess(xmlhttp.responseText);
    }
}
//xmlhttp.open("POST",'https://script.google.com/macros/s/AKfycbzZ-2K0zQJM8BOi1vgckZyxD5nOznBPcE-FUJioaTuGJKKwjog/exec?roll='+roll+'&number='+number,true);
xmlhttp.open("POST",'https://script.google.com/macros/s/AKfycbzTKe77uELGmIfkUqetWf10DyloKDP8s5c8kKL_nay1aiqR-kk/exec?roll='+roll+'&number='+number,true);

xmlhttp.send();
}

//----------------------------------------------------------------------------
function doProcess(data){
  var returnPayload=JSON.parse(data);
  closeLoadBar();
  if(returnPayload.exist==true){
    var html='<b>Name: </b>'+returnPayload.name +'<p><b>Roll No.: </b>Jow/'+returnPayload.roll+' '+returnPayload.number+'<p><b>Registration Number: </b>'+returnPayload.registrationNumber+'<p><b>Passing Month &amp; Year: </b>'+returnPayload.passingMonth +' '+returnPayload.passingYear;
    getE('resultText').innerHTML=html;    
  }else{
    var html='<h3>Sorry:</h3><p>The student with Roll Number <b>Jow/'+roll+' '+number+'</b> is not on record.<p>This may be due to one or more of the following reason:<p>1. The entered Roll Number is wrong.<p>2. The student data have not been updated.<p>3. The student have not pass out.<p><p><i>Please contact the Polytechnic directly to ascertain the same</i>';
    getE('resultText').innerHTML=html;    
  }
}
//----------------------Verify---------------------------------
var roll;
var number;
function callVerify(){
  roll=getE('roll').value;
  number=getE('number').value;
  //Check if roll or number is blank
  if(roll==''){
    getE('errorMessage').innerHTML='Roll cannot be blank.';      
  }
  else if(number==''){
    getE('errorMessage').innerHTML='Number cannot be blank.';      
  }
  else{
    showLoadBar('Verifying.....');
    xhr(roll,number);
  }
}

function verifyNext(){
  getE('number').value='';
  getE('result').setAttribute('class','hidden');
  getE('entry').setAttribute('class','article');
}

//---------------------UTIL------------------------------------
function formatNumber(num,precision){
  var fNum;
	var intNum;
	var decNum;
	var expNum;
	var posExponent=String(num).indexOf("e");
	if (posExponent>-1){
		var x=String(num).split("e");
		fNum=parseFloat(x[0]);
		expNum=x[1];
	}
	else{
		fNum=parseFloat(num);
	}
	var lenNum=String(fNum).length;
	var posDecimal=String(fNum).indexOf(".");
	var p;
	switch(posDecimal){
		case -1:
			intNum=fNum;
			decNum=0;
		break;
		default:
			var n=String(fNum).split(".");
			if (n[0]=="0"){
				intNum=n[0];
				p=parseInt(precision,10);
				if(n[1].length>=p){
					decNum=n[1].substr(0,p)
					while((parseInt(n[1].substr(0,p))==0) && (p<n[1].length+1)){
						p+=1;
						decNum=n[1].substr(0,p);
					}
				}
				else{
					decNum=n[1];
				}
			}
			else{
				p=parseInt(precision,10);
				intNum=n[0];
				decNum=n[1].substr(0,p);
			}
	}
	return parseFloat(intNum+"."+decNum+"e"+expNum);
}
function getE(id){
  return document.getElementById(id);
}
function createE(id){
    return document.createElement(id);
}
//==========================================VALIDATION FUNCTION==============================================
function isNonNumericCode(obj,key,booSigned,booDecimal){
  var keycode=key.keyCode;
	var shift =key.shiftKey;
	if (!shift){
		if(keycode==32){return false;}
		if (keycode > 64 && keycode < 91){return false}//alphabet a to z from 65 to 90
		if (keycode > 185 && keycode < 189){return false}//; = , from 186 to 188
		if (keycode > 190 && keycode < 223){return false}// / (\)' from 191 to 222
		if (keycode == 106 || keycode == 111){return false}// numpad multipy and divide
		if(keycode==189 || keycode==107||keycode==109){
			if(booSigned){
				if(obj.value.length==1){return true;}
				else{return false;}
			}
			else{return false;}
		}
		if (keycode==110 ||keycode==190) {//decimal and period
			if (booDecimal){
				var num=obj.value.toString();
				var cnt=num.split('.');
				if (cnt.length==2){return true;}
				else{return false;}
			}
			else{return false;}
		}
	}else{
		if(booSigned && (keycode==187)){
			if(obj.value.length==1){return true;}
			else{return false;}
		}else{return false;}
	}
	return true;
}

function validateNumber(obj,key){
	if(!isNonNumericCode(obj,key,false,true)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateInteger(obj,key){
	if(!isNonNumericCode(obj,key,false,false)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateSignedNumber(obj,key){
	if(!isNonNumericCode(obj,key,true,true)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateSignedInteger(obj,key){
	if(!isNonNumericCode(obj,key,true,false)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateNumberAndRange(obj,key,minValue,maxValue){
	//### validates positive number where the min value is from 0 to 9 ######

	//check pressed keycodes
	if(!isNonNumericCode(obj,key,false,true)){obj.value=obj.value.substring(0,obj.value.length-1);}

	if (obj.value<minValue){
		obj.value="";
		alert("Number should be at least "+minValue);
	}
	if (obj.value>maxValue){
		obj.value=obj.value.substring(0,obj.value.length-1);
		alert("Number should be at most "+maxValue);
	}
}

function validateMobileNumber(obj){
    var minValue=1000000000;
    var maxValue=9999999999;
    if(isNaN(obj.value)){alert('Mobile Number should be Numeric.');obj.value='';}
    else{
    	if(obj.value>=minValue && obj.value<=maxValue){
        	if(obj.value.indexOf('+')!==-1){alert('Mobile number should not contain a +.');obj.value='';}
		if (obj.value.indexOf('0')==0){alert('Mobile number should not start with 0.');obj.value='';}
      	}
    	else{alert('Mobile Number should be a valid 10 digit number.');obj.value='';}
    }
}

function validateDate(obj){
  if(isValidDate(obj.value)==false){obj.value='';alert('Invalid Date');obj.value='';}
}

function isValidDate(inputText){  
	var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; 
   	// Match the date format through regular expression 
        if(inputText.match(dateformat)){ 
            var opera1 = inputText.split('/');  
            var opera2 = inputText.split('-');  
            var lopera1 = opera1.length;  
            var lopera2 = opera2.length;  
            // Extract the string into month, date and year  
            if (lopera1>1){var pdate = inputText.split('/');}  
            else if (lopera2>1){var pdate = inputText.split('-');}  
            var dd = parseInt(pdate[0]);  
            var mm  = parseInt(pdate[1]);  
            var yy = parseInt(pdate[2]);  
            // Create list of days of a month [assume there is no leap year by default]  
            var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];  
            if (mm==1 || mm>2)  
            {  
                if (dd>ListofDays[mm-1])  
                    {   
                    return false;  
                    }  
            }  
            if (mm==2)  
            {  
                var lyear = false;  
                if ( (!(yy % 4) && yy % 100) || !(yy % 400))   
                {  
                    lyear = true;  
                }  
                if ((lyear==false) && (dd>=29))  
                {   
                return false;  
                }  
                if ((lyear==true) && (dd>29))  
                {    
                    return false;  
                }  
            }  
            return true
        }  
        else  
        {  
            return false;  
	}  
}
//===================================END VALIDATION FUNCTION==============================================
//===================LOADBAR ALERT CONFIRM Functions========================================================================

function showLoadBar(text){
  getE('loader').setAttribute('class','cover');
  getE('spinnerText').innerHTML=text;
  getE('dialog').setAttribute('class','hidden');
}

function closeLoadBar(){
  getE('loader').setAttribute('class','hidden');
  getE('container').setAttribute('class','container');
  getE('dialog').setAttribute('class','hidden');
}

//---global variables----

  //var screenOffsetX;
  //var screenOffsetY;
  
function alert(displayText,title){
  if (arguments.length==2){
    showAlert(displayText,title);
  }
  else{
    showAlert(displayText,"Message:");
  }
}

function jpConfirm(displayText,functionOK,functionCancel){
  
    showAlert(displayText,"Important!",functionOK,functionCancel);
}

function showAlert(displayText,title,functionOK,functionCancel){
  try{
      //screenOffsetX=window.pageXOffset;
      //screenOffsetY=window.pageYOffset;
      //getE('bodyContainer').style.display='none';
      var cover=createE('div');
      cover.setAttribute('id','cover');
      cover.setAttribute('class','cover');
      
      var alertBox=createE('div');
      alertBox.setAttribute('id','jpAlertWindowV1');
      alertBox.setAttribute('class','MessageBox');

    
      var alertTitle=createE('div');
      alertTitle.setAttribute('class','MessageTitle');

      alertTitle.innerHTML=title;
      
      var alertBody=createE('div');
      alertBody.setAttribute('class','MessageBody');
      alertBody.innerHTML=displayText;

    
      var alertFooter=createE('div');
      alertFooter.setAttribute('class','MessageFooter');

      if (arguments.length==4){
        var btn=createE('input');
        btn.type='button';
        btn.value="OK";
        //btn.addEventListener();
        btn.setAttribute('onclick','return '+functionOK);
        alertFooter.appendChild(btn);

        var btnC=createE('input');
        btnC.type='button';
        btnC.value="Cancel";
        btnC.setAttribute('onclick','return '+functionCancel);
        alertFooter.appendChild(btnC);
      }
      else{      
        var btn=createE('input');
        btn.type='button';
        btn.value="OK";
        btn.setAttribute('onclick','return closeAlert()');
        alertFooter.appendChild(btn);
      }
      
      alertBox.appendChild(alertTitle);
      alertBox.appendChild(alertBody);
      alertBox.appendChild(alertFooter);
      cover.appendChild(alertBox);
      document.body.appendChild(cover);
    }
    catch(e){
        window.alert(displayText);
    }
  }
  
  function closeAlert(){
      var cover=getE('cover');
      document.body.removeChild(cover);
      //getE('bodyContainer').style.display='block';  
      //window.scrollBy(screenOffsetX,screenOffsetY);
}

  
  function closeConfirm(){
      closeAlert();
  }

//===================END LOADBAR ALERT CONFIRM Functions========================================================================
