function Product (id, name, unitprice, img, type, desc, quantity) {
    this.id = id;
    this.name = name;
    this.price = unitprice;
    this.img = img;
    this.type = type;
    this.desc = desc;
    this.quantity = quantity;

    this.total = function () {
        return this.quantity * this.price;
    }
}