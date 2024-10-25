function Validator(options) {

  var selectorRules = {};
  function validate(inputElement,rule) {

    function getParent (element,selector){
      while(element.parentElement){
        if(element.parentElement.matches(selector)){
          return element.parentElement;
        }
        element = element.parentElement;
      }

    }

    
    var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
    // console.log(inputElement.value);
    var errorMessage ;
    //lay ra cac rules cua selector && (check)
    // neu co loi thi dung viec kiem tra 
    var rules = selectorRules[rule.selector];
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement,options.formGroupSelector).classList.add("invalid");
    } else {
      errorElement.innerText = "";
      getParent(inputElement,options.formGroupSelector).classList.remove("invalid");
    }
    return !errorMessage; // tra ve true neu khong co loi
  }
  //    Lay element cua form can validate
  var formElement = document.querySelector(options.form);
  //   console.log(options.rules);
  if (formElement) {

    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isFromValid = true;
      options.rules.forEach(function (rule) {
        //lap qua tung rule va validate
        var inputElement = formElement.querySelector(rule.selector); 
        
        var isValid= validate(inputElement,rule);
        if(!isValid){
          isFromValid = false;
        }

        
      //   var formValues = Array.from(enableInputs).reduce(function(values,input){
      //     return (values[input.name] = input.value);

      // },{})

   
    // truong hop submit bang js
        if(isFromValid){
         if (typeof options.onSubmit ==='function')
         {
          var enableInputs = formElement.querySelectorAll('[name]');

          var formValues = Array.from(enableInputs).reduce(function(values,input){
              values[input.name] = input.value;
              return values;

          },{})
          console.log(formValues);
        // console.log(formValues);
          
          options.onSubmit(formValues)
         }
         else{
          formElement.submit();
         }
        }else{
          console.log('co loi');
        }
      });
      //Xu ly lap qua
    }
    //Xu ly lap qua moi rules
    options.rules.forEach(function (rule) {

      // Luu lai cac rule cho moi input
      // selectorRules[rule.selector] = rule.test;
      if( Array.isArray(selectorRules[rule.selector])){
        selectorRules[rule.selector].push(rule.test);
      }else{
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        // Xu ly truong hop blur khoi input
        inputElement.onblur = function () {
          validate(inputElement,rule);
        };
        // Xu ly truong hop nhap vao input
        inputElement.oninput = function () {
            var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);   
            // console.log( inputElement.value);
            errorElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove("invalid");
      }
    }
    });
    // console.log(selectorRules);
  }
}

Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Trường này phải là email";
    },
  };
};
Validator.minLength = function (selector, min) {
    return {
      selector: selector,
      test: function (value) {
          
        return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
      },
    };
  };


Validator.isConfirmed = function (selector,getConfirmValue,message) {
  return {
    selector : selector,
    test : function (value) {
      return value === getConfirmValue() ? undefined : message || 'Gia tri nhap vao khong chinh xac ';
  }
}

}

