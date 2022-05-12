Vue.component('cartpage', {
    data() {
        return {
            products: []
        }
    },
    computed: {
        total() {
            return this.products.reduce((sum, n) => sum + (n.quantity * n.price), 0)
        }
    },
    mounted() {
        this.$parent.getJson('/api/cart')
            .then(data => {
                for (let el of data.contents) {
                    this.products.push(el);

                }
            });
    },
    template: `
    <div>
        <div class="products">
        <p v-if="!products.length" style = "background-color: red; ">Корзина пуста</p>
            <product ref="refref" v-for="item of products" :key="item.id_product" :img="item.img" :product="item"></product>
        </div>
        <h2>Итого: {{total}} </h2>
        </div>

    `
});
Vue.component('product', {
    props: ['product', 'img'],

    template: `

    <div class="product-item">
                <div class="desc">
                <img :src="img" alt="Some img">
                    <h3>{{product.product_name}}</h3>
                    <p>Количество: {{product.quantity}}</p>
                    <p> {{product.quantity*product.price}}₽</p>
                </div>
                
            </div>


            
    `
});
