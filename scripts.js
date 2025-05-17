//Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//S3eleciona os elementos da lista
const expenseList = document.querySelector("ul")
const ExpensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")
//Captura o evento de input, para formatar o valor
amount.oninput = () => {
    //Obtem o valor atual do input , e remove os caracteres não numéricos
    let value = amount.value.replace(/\D/g, "")

    //Transformando o valor em centavos
    value = Number(value) / 100

    //atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}
//Formata o valor no formato BRL
function formatCurrencyBRL(value) {

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
    return value
}

//Captura o evento de Submit do formulário para obter os valores.
form.onsubmit = (event) => {
    //Preve o comportamento padrão de fazer reload na pagina
    event.preventDefault();

    //cria um objeto com os detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    //chama a função que ira adcionar o item a lista
    ExpenseAdd(newExpense)
}

//Adiciona um novo item na lista
function ExpenseAdd(newExpense) {
    try {
        //cria o  elemento para adiconar na lista.
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace
            ("R$", "")}`

        //cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //Adiciona Nome e Categoria na DIV das informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        // Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o item na lista
        expenseList.append(expenseItem)

        //limpa o formulário para adicionar um novo item
        formClear()

        //Atualiza os totais
        updateTotals()



    } catch (error) {
        console.log(error)
        alert(" Não foi possível atualizar a lista de despesas")
    }
}

//Atualiza os totais 
function updateTotals() {
    try {
        //Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        //Atualiza a quantidade de itens da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"
            }`

        //variavel para incrementar o total
        let total = 0

        //Percorre cada item (li) da lista (ul)
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            //Remover caracteres nao numericos, e substituir a virgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            //converte o valor para float.
            value = parseFloat(value)

            //Verifica se é um número valido
            if (isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }

            //Incrementa o valor total
            total += Number(value)
        }

        //cria a span para adiconar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //Formata o valor e remove o R$ que será exibido pelo small com um estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //Limpa o conteudo do elemento
        ExpensesTotal.innerHTML = ""

        //Adiciona o simbolo da moeda e o valor total formatado.
        ExpensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert(" Não foi possível atualizar os totais")
    }
}

//Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
    //Verifica se o icone clicado é o elemento
    if (event.target.classList.contains("remove-icon")) {
        //Obtem a LI pai do elemento cliclado
        const item = event.target.closest(".expense")

        //Remove o item da lista.
        item.remove()
    }

    //atualizad os totais
    updateTotals()

})

function formClear() {
    //Lima os inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    //coloca o foco no input de Amount
    expense.focus()

}

