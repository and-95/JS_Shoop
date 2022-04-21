const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// ПРОМИСЫ
// let getRequest = (url) => {
//     return new Promise((resolve, reject) => {
//         let xhr = new XMLHttpRequest();
//         xhr.open("GET", url, true);
//         xhr.onreadystatechange = () => {
//             if(xhr.readyState === 4){
//                 if(xhr.status !== 200){
//                     reject('Error');
//                 } else {
//                     resolve(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send();
//     })
// };

class ProductList { //класс который собирает все товары из данных(сервер)
    constructor(cart,container = '.items_box') {
        this.container = document.querySelector(container);//понимаем где рисовать 
        this.productsObjects = []; //массив, где храним готовые объекты продуктов
        this.cart = cart;
        this.getProducts()
            .then((data) => {
                this.goods = data;
                this.render();
            });
            this._init();
    }
    _init(){
        document.querySelector('.items_box').addEventListener('click', e => {
          if(e.target.classList.contains('buy-btn')){
            this.cart.addProduct(e.target);
          }
        });
    }

    getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(response => response.json())
            .catch(err => console.log(err));
    }

    render() {
        for (const product of this.goods) {
            const productObject = new ProductItem(product);
            console.log(productObject);

            this.productsObjects.push(productObject);
            this.container.insertAdjacentHTML('beforeend', productObject.getHTMLString());
        }
    }
}


class ProductItem {
    constructor(product) {
        this.name = product.product_name;
        this.id = product.id_product;
        this.price = product.price;
        this.img; //= 'img/sushi/sushi3.png';
        this.quantity = product.quantity;
    }

    getHTMLString() {
        return `<div class="item" data-id="${this.id}">
        <img src="" alt="">
        <div class="item_name">${this.name}</div>
        <div class="item_price">${this.price} руб.</div>
        <button class="button buy-btn" data-id="${this.id}"
        data-name="${this.name}"
        data-price="${this.price}">В корзину</button>
        </div>`;
    }

    renderToCart() {
        return `<div class="cart-item" data-id="${this.id}">
            <div class="product-bio">
            <div class="product-desc">
            <p class="product-title">${this.name}</p>
            <p class="product-quantity">Количество: ${this.quantity}</p>
        <p class="product-single-price">${this.price} за ед.</p>
        </div>
        </div>
        <div class="right-block">
            <p class="product-price">${this.quantity*this.price} ₽</p>
            <button class="del-btn" data-id="${this.id}">&times;</button>
        </div>
        </div>`
    }
}

class Cart {
    constructor(container = ".cart-block"){
        this.allProducts = [];
        this.goods = [];
        this._init();
        
    }
    getJson(url){
        return fetch(url ? url : `${API + this.url}`)
          .then(result => result.json())
          .catch(error => {
            console.log(error);
          })
      }
    
  
    addProduct(element){
        this.getJson(`${API}/addToBasket.json`)
      .then(data => {
        if(data.result === 1){
            console.log(data.result);
            let productId = +element.dataset['id'];
            console.log(this.allProducts);
            let find = this.allProducts.find(product => product.id === productId);
            if(find){
              find.quantity++;
              this._updateCart(find);
            } else {
              let product = {
                id_product: productId,
                price: +element.dataset['price'],
                product_name: element.dataset['name'],
                quantity: 1
              };
              this.goods = [product];
              this.renderCart();
            }
        } else {
            alert('Error');
          }
        })
    }

    removeProduct(element){
        this.getJson(`${API}/deleteFromBasket.json`)
          .then(data => {
            if(data.result === 1){
              let productId = +element.dataset['id'];
              let find = this.allProducts.find(product => product.id === productId);
              if(find.quantity > 1){ 
                find.quantity--;
                this._updateCart(find);
              } else { 
                this.allProducts.splice(this.allProducts.indexOf(find), 1);
                document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
              }
            } else {
              alert('Error');
            }
          })
      }
  
    _updateCart(product){
      let block = document.querySelector(`.cart-item[data-id="${product.id}"]`);
      block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
      block.querySelector('.product-price').textContent = `${product.quantity * product.price} ₽`;
    }
    _init(){
      document.querySelector('.header_button').addEventListener('click', () => {
        document.querySelector(".cart-block").classList.toggle('invisible');
      });
      document.querySelector('.cart-block').addEventListener('click', e => {
        if(e.target.classList.contains('del-btn')){
          this.removeProduct(e.target);
          console.log(e.target);
        }
      });
    }

    renderCart(){
        const block = document.querySelector(".cart-block");
        for (let product of this.goods){
           let productObj = null;
          
          productObj = new ProductItem(product);
          if (!productObj) return;
    
         // console.log(productObj);
          this.allProducts.push(productObj);
          block.insertAdjacentHTML('beforeend', productObj.renderToCart());
        }
      }
  }

  let cart = new Cart();
  let products = new ProductList(cart);

