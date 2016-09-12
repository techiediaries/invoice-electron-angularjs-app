var app = angular.module('invoiceapp',[]);
app.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});

app.constant('EMPTY_INVOICE',{
  no: '1',
  tax: '20.00',
  date:'',
  amount:'0.00',
  currencySymbol:'$',
  logo:'',
  customer: {
  	'name':'Mr. Mister',
  	'address':'Address',
  	'phone': '0528838379',
  	'email': 'email@techiediaries.com'
  },
  company: {
  	'name':'Comapny Name',
  	'address':'Comany Addess',
  	'phone': '0528838379',
  	'email': 'email@techiediaries.com'
  },
  items:[
  
  ]
  ,
  total:'0.00',
  paid:'0.00',
  due:'0.00',
  meta:{
  	header:''
  }
});

app.controller('InvoiceCtrl',function($scope,EMPTY_INVOICE){
	
	// at start set the invoice to an empty one
	$scope.editMode = true;
	$scope.printMode = false;
	$scope.invoice = EMPTY_INVOICE;
	$scope.noLogo = false;
	$scope.calculateSubTotal = function calculateTotal(){
    	var total = 0.00;
    	angular.forEach($scope.invoice.items, function(item, key){
      		total += (item.quantity * item.rate);
    	});
    	return total;
  	};

  	$scope.calculateTax = function() {
    	return (($scope.invoice.tax * $scope.calculateSubTotal())/100);
  	};
  	$scope.calculateTotal = function() {
    
    	return $scope.calculateTax() + $scope.calculateSubTotal();
  	};
	
  	$scope.toggleEditMode = function(){
    	$scope.editMode = $scope.editMode === false ? true: false;
  	};

  	$scope.togglePrintMode = function(){
    	$scope.printMode = $scope.printMode === false ? true: false;
  	};
  	$scope.addItem = function(){

  		$scope.invoice.items.push({name:'Item Name','description':'Item Description','rate':'0.00','quantity':'0','price':0});
  	
  	}
  	$scope.removeItem = function(item){
  		$scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
  	}

   angular.element(document).ready(function () {
   
	document.getElementById('logoInput').onchange = function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('logo').setAttribute('src', e.target.result);
        
      }
      	reader.readAsDataURL(this.files[0]);
    }
    };
  }); 	

});