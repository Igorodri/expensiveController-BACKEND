var i = 1;
var contador_linhas = document.getElementById("linhas");
var numero = document.getElementById("numero");
contador_linhas.innerHTML = i;
numero.innerHTML = 1;

var valor_ap = document.getElementsByClassName("value_ap");
var nome_ap = document.getElementsByClassName("name_ap");
var input_data = document.getElementsByClassName("date_application");

function plus() {
    var tabela = document.getElementById("tabela");
    var novaLinha = tabela.insertRow(-1); // Insere uma nova linha no final da tabela
      
    
    // Cria e insere as células na nova linha
    var celula1 = novaLinha.insertCell(0);
    var celula2 = novaLinha.insertCell(1);
    var celula3 = novaLinha.insertCell(2);
    var celula4 = novaLinha.insertCell(3);


    for(i = 0; i<tabela.rows.length; i++){
        contador_linhas.innerHTML = i;
        valor_ap.disabled = true;
        nome_ap.disabled = true;
    }

    

    celula1.innerHTML = tabela.rows.length - 1; 

    celula2.innerHTML = "<td><input type='date' class='date_application'  name='date_application'></td>";

    celula3.innerHTML = "<td><input type='text' placeholder='Insira o nome da Aplicação' class='name_application' name='name_ap'></td>";

    celula4.innerHTML = "<td><input type='number' placeholder='Insira o valor da Aplicação' class='value_application' name='value_ap'></td>";

    calcular_despesas();
    
}

function minus() {
    var tabela = document.getElementById("tabela");

    if (tabela.rows.length > 2) {
        tabela.deleteRow(tabela.rows.length - 1);
        contador_linhas.innerText = tabela.rows.length - 1;
        valor_ap.disabled = false;
        nome_ap.disabled = false;
        
    } else {
        alert("Não há mais linhas para remover!");
    }
}

function deleteall() {

    var tabela = document.getElementById("tabela");
    var sale = document.getElementById("sale");

    // Verifica se a tabela tem mais de uma linha (presumindo que a primeira linha é o cabeçalho)
    if (tabela.rows.length > 1) {
        // Remove todas as linhas exceto o cabeçalho e a primeira linha da tabela
       
        for (var i = tabela.rows.length - 2; i > 0; i--) {
            tabela.deleteRow(i + 1);

            contador_linhas.innerText = 1;
            despesas.innerHTML = 0;
            sale.innerHTML = 0;
        
        }
    } else {
        alert("Não há mais linhas para remover!");
    }
}

function calcular_despesas() {
    var despesas = document.getElementById("despesas");
    var inputs = document.querySelectorAll(".value_application");
    var sale = document.getElementById("sale");
    var total_ap = 0;
    
    // Converte o valor do sale para número, assumindo 0 se não for numérico
    var saldo = parseFloat(sale.value) || 0; 

    inputs.forEach(function(input) {
        var valor_ap = parseFloat(input.value) || 0;
        total_ap += valor_ap;
    });

    despesas.innerHTML = total_ap; // Atualiza as despesas

    // Calcula o novo saldo e atualiza o valor de sale

    var novoSaldo = 0;

    parseFloat(novoSaldo);

    novoSaldo = saldo - total_ap;
    sale.innerHTML = novoSaldo 

    if(novoSaldo < total_ap){
        alert("Saldo insuficiente")
        return minus();
        sale.innerHTML = 0
        novoSaldo = 0;
    }
}

function add_cash() {
    var saldoAtual= document.getElementById("sale");
    var saldo_add = document.getElementById("saldo_add");

    var newsaldo = parseFloat(saldo_add.value)

    var valorAtual = parseFloat(saldoAtual.innerText);

    
    // Adiciona os valores
    var novoValor = valorAtual + newsaldo;

    
    if(isNaN(novoValor)){
        alert("Valor inválido!");
        return;
    }
    // Atualiza o texto do elemento <p>

    saldoAtual.textContent = novoValor;
    saldoAtual.value = novoValor;
    saldo_add.value = ""

  

}

function remove_cash() {
    var saldoAtual= document.getElementById("sale");
    var saldo_remove = document.getElementById("saldo_remove");

    var newsaldo = parseFloat(saldo_remove.value)

    var valorAtual = parseFloat(saldoAtual.innerText);

    
    // Adiciona os valores
    var novoValor = valorAtual - newsaldo;

    
    if(isNaN(novoValor)){
        alert("Valor inválido!");
        return;
    }
    // Atualiza o texto do elemento <p>

    saldoAtual.textContent = novoValor;
    saldoAtual.value = novoValor;
    saldo_add.value = ""

  
}


