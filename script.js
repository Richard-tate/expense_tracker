const balance = document.querySelector("#balance");
const money_plus = document.querySelector("#money-plus");
const money_minus = document.querySelector("#money-minus");
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const text = document.querySelector("#text");
const amount = document.querySelector("#amount");
const toggle = document.querySelector(".btn-toggle");
const show_hide = document.querySelector(".show-hide-listBtn");
const show = document.querySelector(".show-hide-listBtn i");
const clearAll = document.querySelector(".clearAllBtn");
const close_modal = document.querySelector(".close-modal-btn");
const delete_items = document.querySelector(".delete-items-btn");
const overlay = document.querySelector(".overlay");

form.addEventListener("submit", addTransaction);

show_hide.addEventListener("click", () => {
	document.querySelector(".list").classList.toggle("hide");
	show.classList.toggle("fa-angle-up");
	show.classList.toggle("fa-angle-down");
});

const openModal = ({ target }) => {
	if (target.innerText === "Clear all") {
		overlay.classList.add("show");
	}
	if (target.innerText === "Cancel") {
		overlay.classList.remove("show");
	} else if (overlay && target === overlay) {
		overlay.classList.remove("show");
	} else {
		return;
	}
};

clearAll.addEventListener("click", openModal);
close_modal.addEventListener("click", openModal);
overlay.addEventListener("click", openModal);
const localStorageTransactions = JSON.parse(
	localStorage.getItem("transactions"),
);

let transactions =
	localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const toggleLight_dark = () => {
	document.body.classList.toggle("dark");
};
toggle.addEventListener("click", toggleLight_dark);

function addTransaction(e) {
	e.preventDefault();

	if (text.value.trim() === "" || amount.value.trim() === "") {
		alert("please add a text and amount");
	} else {
		const transaction = {
			id: generateId(),
			text: text.value,
			amount: +amount.value,
		};
		transactions.push(transaction);
		addTransactionDOM(transaction);
		updateValues();

		updateLocalStorage();

		text.value = "";
		amount.value = "";
	}
}

function generateId() {
	return Math.floor(Math.random() * 1000000000);
}

function addTransactionDOM(transaction) {
	const sign = transaction.amount < 0 ? "-" : "+";

	const item = document.createElement("li");

	item.classList.add(transaction.amount < 0 ? "minus" : "plus");

	item.innerHTML = `
	<button class="delete-btn" onclick="removeTransaction(${
		transaction.id
	})">X</button>
   	<p> <span>${transaction.text}</span> <span>${sign}${Math.abs(
		transaction.amount,
	)}</span></p> 
    `;
	list.appendChild(item);
}

function updateValues() {
	const amounts = transactions.map((transaction) => transaction.amount);

	const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

	const income = amounts
		.filter((item) => item > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);

	const expense = (
		amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
		-1
	).toFixed(2);

	balance.innerText = `£${total}`;
	money_plus.innerText = `£${income}`;
	money_minus.innerText = `£${expense}`;
}

function removeTransaction(id) {
	transactions = transactions.filter((transaction) => transaction.id !== id);
	updateLocalStorage();

	init();
}

function updateLocalStorage() {
	localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
	list.innerHTML = "";

	transactions.forEach(addTransactionDOM);
	updateValues();
}
init();
