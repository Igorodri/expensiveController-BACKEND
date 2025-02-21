function analisar(){
    var email = document.getElementById("email");
    var senha = document.getElementById("senha");

    var array = [email,senha];

    for(var i = 0; i < array.length; i++){
        if(array[i].value == ""){
            array[i].style.borderColor = "red";
        }else{
            array[i].style.borderColor = "green";
        }
    }
}