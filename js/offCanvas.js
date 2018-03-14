'use strict';

function getFormData(){ 
     var email = $('#email');
     var subject = $('#subject');
     var body = $('#msgBody');
     var formData = {}; 

     formData.email = email[0].value;
     formData.subject = subject[0].value;
     formData.body = body[0].value;

     return formData;
}

function createUrl(mail, subject, body){
    var urlStr = "https://mail.google.com/mail/?view=cm&fs=1&to=" + mail + "&su=" + subject + "&body=" + body;
    return urlStr;
}


function navToUrl(){
    var formData = getFormData();
    var url = createUrl(formData.email, formData.subject, formData.body);
    window.open(url);
}

function renderForm(){
    var elContact = $('#contact');
  
    var strHtml = 
`<form>
    <div class="form-group">
     <label for="exampleInputEmail1">Your E-mail</label>
     <input type="email" id="email" class="form-control" aria-describedby="emailHelp" placeholder="name@example.com">
   </div>
    <div class="form-group">
     <label for="exampleInputPassword1">subject</label>
     <input type="text" id="subject" class="form-control" placeholder="Type subject here">
   </div>
  <div class="form-group">
   <label for="exampleInputPassword1">Message Body</label>
   <input type="text" id="msgBody" class="form-control" placeholder="Type message text here">
  </div>
  <button type="button" class="btn btn-primary" onclick="navToUrl()">Submit</button>
</form>`;
  
    elContact.html(strHtml);
  }


function openCanvas(){
    document.querySelector('.offcanvas-btn').classList.toggle('offcanvas-btn-open');
    document.querySelector('.offcanvas-aside').classList.toggle('offcanvas-aside-open');   
    renderForm(); 
}