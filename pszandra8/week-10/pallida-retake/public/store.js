'use strict';

window.addEventListener('load', () => {
  let httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', `http://localhost:8080/warehouse`);
  httpRequest.setRequestHeader('Accept', '*');
  httpRequest.setRequestHeader('Content-type', 'application/json');
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let response = JSON.parse(httpRequest.responseText);
    response.forEach(element => tableCreator(element));}
  }})

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  let httpRequest = new XMLHttpRequest();
  let item_name = event.target.elements.namedItem('itemSelector').value;
  let size = event.target.elements.namedItem('sizeSelector').value;
  let quantity = event.target.elements.namedItem('quantity').value;
  httpRequest.open('GET', `http://localhost:8080/warehouse/price-check/?item=${item_name}&size=${size}&quantity=${quantity}`);
  httpRequest.setRequestHeader('Accept', '*');
  httpRequest.setRequestHeader('Content-type', 'application/json');
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let response = JSON.parse(httpRequest.responseText);
    let orderInfo = document.querySelector('h2');
    if (response.result === "OK") {
      if (orderInfo.classList.contains('error')) {
        orderInfo.classList.remove('error');
      }
      orderInfo.classList.add('order');
      orderInfo.textContent = `You can order the selected items! The total price would be: ${response.total_price} pounds`;
    } else {
      orderInfo.classList.add('error');
      orderInfo.textContent = 'There was an error with the order.';
    }
  }
  }
})

let table = document.querySelector('table');
let head = document.createElement('thead');
let headRow = document.createElement('tr');
let body = document.createElement('tbody');

for (let i = 0; i < 5; i++) {
  let headField = document.createElement('th');
  head.appendChild(headField);
  let headFieldContent = ['Item name', 'Manufacturer', 'Category', 'Size', 'Unit price'];
  headField.textContent = headFieldContent[i];
}

const tableCreator = function(element) {
  const bodyrow = document.createElement('tr');
  table.appendChild(head);
  table.appendChild(headRow);
  table.appendChild(body);
  table.appendChild(bodyrow);

  const data = document.createElement('td');
  data.textContent = element.item_name;
  bodyrow.appendChild(data);
  const data2 = document.createElement('td');
  data2.textContent = element.manufacturer;
  bodyrow.appendChild(data2);
  const data3 = document.createElement('td');
  data3.textContent = element.category;
  bodyrow.appendChild(data3);
  const data4 = document.createElement('td');
  data4.textContent = element.size;
  bodyrow.appendChild(data4);
  const data5 = document.createElement('td');
  data5.textContent = element.unit_price;
  bodyrow.appendChild(data5);
}