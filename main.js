const select = document.getElementById('cars');
const title = document.getElementById('car-title');
const price = document.getElementById('car-price');
const errorMessage = document.getElementById('error');

// JSON находится в index.html, чтобы для задания хватило двух файлов.
const json = document.getElementById('cars-data').textContent;
const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);

fetch(dataUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Ответ сервера: ' + response.status);
    }
    return response.json();
  })
  .then((data) => {
    if (!Array.isArray(data.cars) || data.cars.length === 0) {
      throw new Error('Список автомобилей пуст или повреждён');
    }

    data.cars.forEach((car, index) => {
      if (typeof car.brand !== 'string' ||
          typeof car.model !== 'string' ||
          typeof car.price !== 'number') {
        throw new Error('Неверные данные автомобиля');
      }

      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = car.brand;
      select.append(option);
    });

    select.disabled = false;
    select.addEventListener('change', () => {
      if (select.value === '') {
        title.textContent = 'выбери тачку';
        price.hidden = true;
        return;
      }

      const car = data.cars[Number(select.value)];
      title.textContent = 'Тачка ' + car.brand + ' ' + car.model;
      price.textContent = 'Цена: ' + car.price + '$';
      price.hidden = false;
    });
  })
  .catch((error) => {
    select.disabled = true;
    errorMessage.textContent = 'Не удалось загрузить автомобили: ' + error.message;
    errorMessage.hidden = false;
  });