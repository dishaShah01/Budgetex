var budgetcontroller=(function(){
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    
    Expense.prototype.calcpercentage=function(totalincome){
        if(totalincome>0){this.percentage=Math.round(this.value/totalincome*100);}else{this.percentage=-1;}
    };
    Expense.prototype.getpercentage=function(){
      return this.percentage;  
    };
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;        
    };
    
    var calculatetotal=function(type){
      var sum=0;
        data.allitems[type].forEach(function(cur){
            sum+=cur.value;            
        });
        data.totals[type]=sum;
    };
    var data={
        allitems:{
            exp:[],
            inc:[]
            
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    
    return{
        additem:function(type,des,val){
            var newitem;
            if (data.allitems[type].length>0){
            var ID= data.allitems[type][data.allitems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            if(type==='exp'){
            newitem= new Expense(ID,des,val);}
            else if(type==='inc'){
                newitem=new Income(ID,des,val);
            }
            data.allitems[type].push(newitem);
            return newitem;
        },
        
        deleteitem:function(type,id){
          var ids=data.allitems[type].map(function(current){
              return current.id;
          });
           var index=ids.indexOf(id);
            if(index!==-1){
                data.allitems[type].splice(index,1);
            }
        },
        calculatebudget:function(){
            calculatetotal('exp');
            calculatetotal('inc');
            data.budget=data.totals.inc-data.totals.exp;
           if(data.totals.inc>0){ data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);}
            else{data.percentage=-1;}
        },
        calculatepercentage:function(cur){
            data.allitems.exp.forEach(function(cur){
               cur.calcpercentage(data.totals.inc); 
            });
        },
        getpercentage:function(){
          var allperc=data.allitems.exp.map(function(cur){
             return cur.getpercentage(); 
          });  
            return allperc;
        },
        getbudget:function(){
         return{
             budget:data.budget,
             totalinc:data.totals.inc,
             totalexp:data.totals.exp,
             percentage:data.percentage
         };   
        }
    };
})();

var UIcontroller=(function(){
    var domstrings={
        inputtype:'.add__type',
        inputdescription:'.add__description',
        inputvalue:'.add__value',
        inputbtn:'.add__btn',
        incomecontainer:'.income__list',
        expensecontainer:'.expenses__list',
        budgetlabel:'.budget__value',
        incomelabel:'.budget__income--value',
        expenselabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container:'.container',
        expperclabel:'.item__percentage',
        datelabel:'.budget__title--month'
    };
    
    var formatnumber= function(num,type){
            var numsplit,int,dec;
          num=Math.abs(num);
            num=num.toFixed(2);
            numsplit=num.split('.');
            int =numsplit[0];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
            dec=numsplit[1];
            ;
            return (type==='exp'? '-': '+')+' '+int+'.'+dec;
        };
    var nodelistforeach=function(list,callback){
              for(var i=0;i<list.length;i++){
                  callback(list[i],i);
              }  
            };
    return{
        getinput:function(){
            return{
             type:document.querySelector(domstrings.inputtype).value,
             description:document.querySelector(domstrings.inputdescription).value,
             value:parseFloat(document.querySelector(domstrings.inputvalue).value)
            };
            
        },
        addlistitems:function(obj,type){
            var html,element;
            if(type==='inc'){
                element=domstrings.incomecontainer;
           html=' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
            
            else if(type==='exp'){
                element=domstrings.expensecontainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
            
            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',formatnumber (obj.value,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
                
            },
        
        deletelistitems:function(selectorid){
            var el=document.getElementById(selectorid);
            el.parentNode.removeChild(el);
            
        },
        
        clearfields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(domstrings.inputdescription + ', ' + domstrings.inputvalue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        displaybudget:function(obj){
            var type;
           obj.budget>0?type='inc':type='exp'; document.querySelector(domstrings.budgetlabel).textContent=formatnumber(obj.budget,type);
            document.querySelector(domstrings.incomelabel).textContent=formatnumber(obj.totalinc,'inc');
            document.querySelector(domstrings.expenselabel).textContent=formatnumber(obj.totalexp,'exp');
            
            if(obj.percentage>0){document.querySelector(domstrings.percentagelabel).textContent=obj.percentage+"%";
            }else{
                document.querySelector(domstrings.percentagelabel).textContent="---";
            }
            
        },
        displaypercentage:function(percentages){
            var fields=document.querySelectorAll(domstrings.expperclabel);
            
            nodelistforeach(fields,function(current,index){
               if(percentages[index]>0){ current.textContent=percentages[index]+'%';}else{
                   current.textContent='---';
               }
            });
        },
        
        displaymonth:function(){
            var now,year,month,months;
          now=new Date();
            months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(domstrings.datelabel).textContent=months[month]+' '+year;
        },
        
        changedtype:function(){
            var fields=document.querySelectorAll(
            domstrings.inputtype+','+
                domstrings.inputdescription+','+
                domstrings.inputvalue);
            
            nodelistforeach(fields,function(cur){
               cur.classList.toggle('red-focus'); 
            });
            document.querySelector(domstrings.inputbtn).classList.toggle('red');
            },
        getdomstrings: function() {
            return domstrings;
        }
    };
})();

var controller=(function(budgetctrl,UIctrl){
    var setupeventlisteners=function(){
      var dom=UIctrl.getdomstrings();
        document.querySelector(dom.inputbtn).addEventListener('click',ctrladditem);
   document.addEventListener('keypress',function(event){
       if(event.keyCode===13||event.which===13){
           ctrladditem();
       } 
       
   });
        document.querySelector(dom.container).addEventListener('click',ctrldeleteitem);
        
        document.querySelector(dom.inputtype).addEventListener('change',UIctrl.changedtype);
        

    };
    
   var updatebudget=function(){
       budgetctrl.calculatebudget();
       var budget=budgetctrl.getbudget();
       UIctrl.displaybudget(budget);
   }; 
    var updatepercentages=function(){
        budgetctrl.calculatepercentage();
        var percentages=budgetctrl.getpercentage();
        UIctrl.displaypercentage(percentages);
    };
   var ctrladditem=function(){
       var input=UIctrl.getinput();
       console.log(input);
       if(input.description!=="" && !isNaN(input.value) && input.value>0){
       var newitem=budgetctrl.additem(input.type,input.description,input.value);
       UIctrl.addlistitems(newitem,input.type);
       UIctrl.clearfields();
       updatebudget();
           updatepercentages();
       }
   };
    
    var ctrldeleteitem=function(event){
       var itemid,splitid,type,id; itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemid){
            splitid=itemid.split('-');
            type=splitid[0];
            id=parseInt(splitid[1]);
            budgetctrl.deleteitem(type,id);
            UIctrl.deletelistitems(itemid);
            updatebudget();
            updatepercentages();
        }
    };
    return{
        init: function(){
            console.log('start');
           UIctrl.displaymonth(); UIctrl.displaybudget({budget:0,totalinc:0,totalexp:0,percentage:-1});
            setupeventlisteners();
        }
    }

})(budgetcontroller,UIcontroller);

controller.init();
