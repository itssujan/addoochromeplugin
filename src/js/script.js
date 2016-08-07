!function(){
	console.log("Im in script.js");debugger;


// addEventListener("click", function() {
//     console.log("You clicked! ");
//     console.log(this);
//   });

if (document.addEventListener ){
    document.addEventListener("click", function(event){
        var targetElement = event.target || event.srcElement;
        console.log(targetElement);
    });
} else if (document.attachEvent) {    
    document.attachEvent("onclick", function(){
        var targetElement = event.target || event.srcElement;
        console.log(targetElement);
    });
}

}()