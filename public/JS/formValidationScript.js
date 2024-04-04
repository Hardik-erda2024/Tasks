function formValidationFun() {

  let flag = false;
  let req = document.getElementsByClassName('required');
  let err = document.querySelectorAll('.err');

  if (err.length != 0) {
    for (i = 0; i < err.length; i++) {
      err[i].remove();
    }
  }
  for (i in req) {
    if (req[i].value == "") {
      let span = document.createElement('span');
      span.innerHTML = " * ";
      span.className = "err";
      span.style = "color: red;";
      req[i].after(span);
      
      flag = true;
    }
  }

  /* email validator - START*/ 
  let emailvalidate = document.querySelectorAll('.emailvalidate');
  let emailRegx =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (emailvalidate.length != 0) {
    for (i = 0; i < emailvalidate.length; i++) {
      if(!(emailvalidate[i].value.match(emailRegx)) && !(emailvalidate[i].value == '')){
        let span = document.createElement('span');
        span.innerHTML = " Enter valid email";
        span.className = "err";
        span.style = "color: red;";
        emailvalidate[i].after(span);
        flag = true
      }
    }
  }
/* email validator - END*/


/* phone validator - START*/ 
  let phonevalidate = document.querySelectorAll('.phonevalidate');
  let phoneRegx =  /^[6-9][0-9]{9}$/;
  if (phonevalidate.length != 0) {
    for (i = 0; i < phonevalidate.length; i++) {
      if(!(phonevalidate[i].value.match(phoneRegx)) && !(phonevalidate[i].value == '')){
        let span = document.createElement('span');
        span.innerHTML = " Enter valid number(india)";
        span.className = "err";
        span.style = "color: red;";
        phonevalidate[i].after(span);
        flag = true
      }
    }
  }
/* phone validator - END*/



/* zipcode validator - START*/ 
let zipcodevalidate = document.querySelectorAll('.zipcodevalidate');
let zipcodeRegx =  /^[1-9][0-9]{5}$/;
if (zipcodevalidate.length != 0) {
  for (i = 0; i < zipcodevalidate.length; i++) {
    if(!(zipcodevalidate[i].value.match(zipcodeRegx)) && !(zipcodevalidate[i].value == '')){
      let span = document.createElement('span');
      span.innerHTML = " Enter valid zip code(india)";
      span.className = "err";
      span.style = "color: red;";
      zipcodevalidate[i].after(span);
      flag = true;
    }
  }
}
/* zipcode validator - END*/

/* dropdown validator - START */
let ddvalidate = document.querySelectorAll('.dropDownValidate');
if(ddvalidate.length !=0){
  for(i=0;i<ddvalidate.length;i++){
    if(ddvalidate[i].value == 'select'){
      let span =document.createElement('span');
      span.className = 'err';
      span.innerHTML = " * ";
      span.style = 'color:red';
      ddvalidate[i].after(span);
      flag=true;
    }
  }
}
/* dropdown validator - END */

/* dateValidator - START */ 
let datevalidate = document.querySelectorAll('.dateValidator');
let dateRegx =  /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
if(datevalidate.length !=0){
  for(i=0;i<datevalidate.length;i++){
    if(!(datevalidate[i].value.match(dateRegx)) && !(datevalidate[i].value == '')){
      
      let span = document.createElement('span');
      span.innerHTML = " Enter valid date(YYYY-MM-DD)";
      span.className = "err";
      span.style = "color: red;";
      datevalidate[i].after(span);
      flag = true;
    }
  }
}

/* dateValidator - END */


/* paraRequired - START */

let paraRequired = document.querySelectorAll('.paraRequired');
let paraFlag = 0;
let len =0;
if(paraRequired.length != 0){
  for(i=0;i<paraRequired.length;i++){
    let parachildren = paraRequired[i].children;
    for(j=0;j<parachildren.length;j++){
      if(parachildren[j].value != undefined){
        len++;
        if(parachildren[j].value != '' ){
          paraFlag++;
        }
      }
    }
    if(paraFlag <len && paraFlag != 0){
      for(i=0;i<parachildren.length;i++){
        if(parachildren[i].value != undefined){
          let span = document.createElement('span');
          span.innerHTML = " * ";
          span.className = "err";
          span.style = "color: red;";
          parachildren[i].after(span);
          flag = true;
        }
      }
    }
    len =0;
    paraFlag = 0;  
  }
}

/* paraRequired - END */

/* isYear -START */
  let isYear = document.querySelectorAll('.isYear');
  if(isYear.length !=0){
    let yearRegx = /^\d{4}$/;
    for(i=0;i<isYear.length;i++){
      if(! (isYear[i].value.match(yearRegx)) && isYear[i].value!=''){
        let span = document.createElement('span');
          span.innerHTML = " invalid year ";
          span.className = "err";
          span.style = "color: red;";
          isYear[i].after(span);
          flag = true;
      }
    }

  }
/* isYear -END */

/* percentageValidator - START */
let percentageValidator = document.querySelectorAll('.percentageValidator');
if(percentageValidator.length !=0){
  for(i=0;i<percentageValidator.length;i++){
    if(percentageValidator[i].value != ''){
      let x = parseFloat(percentageValidator[i].value);
      if (isNaN(x) || x < 1 || x > 100) {
        let span = document.createElement('span');
        span.innerHTML="invalid percentage";
        span.style.color = 'red';
        span.className = "err";
        percentageValidator[i].after(span);
      }
    }
  }
}
/* percentageValidator - END */

/* isDigit - START */
let isDigit = document.querySelectorAll('.isDigit');
if(isDigit.length !=0){
  let digitRegx = /^\d+|\d+\.\d{2}$/;
  for(i=0;i<isDigit.length;i++){
    if(! (isDigit[i].value.match(digitRegx)) && isDigit[i].value!=''){
      let span = document.createElement('span');
        span.innerHTML = " invalid number ";
        span.className = "err";
        span.style = "color: red;";
        isDigit[i].after(span);
        flag = true;
    }
  }

}
/* isDigit - END */


  if (flag == true) {
    return false;
  }
}

function removeFun(id){
  if(document.getElementById(id).options[0].text =='--select--'){
    document.getElementById(id).remove(0)
  }
}