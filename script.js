class ProductList { //класс который собирает все товары из данных(сервер)
    constructor(container = '.items_box') {
        this.container = document.querySelector(container);//понимаем где рисовать 
        this.goods = [];//массив для хранения данных с сервера
        this.productsObjects = []; //массив, где храним готовые объекты продуктов

        this.loadGoods(); //запускаем методы
        this.renderToHTML();
        this.sumPriceOfProducts();
    }

    loadGoods() { //загружаем с сервера
        this.goods = [
            { id: 1, name: 'Крабстер', price: 300, img: 'img/sushi/sushi1.png' },
            { id: 2, name: 'Набор "Вкуснейший"', price: 900, img: 'img/sushi/sushi2.png' },
            { id: 3, name: 'Филадельфия', price: 500, img: 'img/sushi/sushi3.png' },
            { id: 4, name: 'Эби Эдзуми', price: 420, img: 'img/sushi/sushi1.png' },
            { id: 5, name: 'Сочные', price: 450, img: 'img/sushi/sushi2.png' },
            { id: 6, name: 'НашиСуши', price: 600, img: 'img/sushi/sushi3.png' },
        ];
    }

    renderToHTML() {// создаем хтмл код с товаром в нужном месте
        for (const product of this.goods) {
            const productObject = new ProductItem(product);
            this.productsObjects.push(productObject);
            this.container.insertAdjacentHTML('beforeend', productObject.getHTMLString());
        }

    }

    sumPriceOfProducts(){ // метод для ДЗ
        let sum = 0;
        for (const product of this.goods) {
        sum += product.price;
        }
        console.log('Сумма цен на сайте = '+ sum);
    }
    
}


class ProductItem {
    constructor(product) {
        this.name = product.name;
        this.id = product.id;
        this.price = product.price;
        this.img = product.img;
    }

    getHTMLString() {
        return `<div class="item" data-id="${this.id}">
        <img src="${this.img}" alt="">
        <div class="item_name">${this.name}</div>
        <div class="item_price">${this.price} руб.</div>
        <button class="button">В корзину</button>
        </div>`;
    }
}
new ProductList();

