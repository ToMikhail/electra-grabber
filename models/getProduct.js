const getProduct = (iterator, productItem) => {
  const item = iterator.split(':')[0]
  switch (item) {
    case 'Каталог ':
      productItem.catalog = iterator.split(':')[1].trim();
      break;
    case 'Категория ':
      productItem.category = iterator.split(':')[1].trim();
      break;
    case 'Бренд ':
      productItem.brand = iterator.split(':')[1].trim();
      break;
    case 'Линейка продукции ':
      productItem.productLine = iterator.split(':')[1].trim();
      break;
    case 'Тип изделия ':
      productItem.productType = iterator.split(':')[1].trim();
      break;
    case 'Количество полюсов ':
      productItem.numberOfPoles = iterator.split(':')[1].trim();
      break;
    case 'Номинальный ток, A ':
      productItem.ratedCurrent = iterator.split(':')[1].trim();
      break;
    case 'Отключающая способность, kA ':
      productItem.breakingCapacity = iterator.split(':')[1].trim();
      break;
    case 'Количество модулей ':
      productItem.numberOfModules = iterator.split(':')[1].trim()
      break
    case 'Вес, kg ':
      productItem.weight = item.split(':')[1] === undefined ? undefined : item.split(':')[1].trim();
      break;
  }

  return productItem;
}

module.exports = getProduct;