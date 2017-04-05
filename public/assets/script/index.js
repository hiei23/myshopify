/****************************************** Main ******************************************/
const URL = "https://gointegrations-devtest.myshopify.com" 

$(document).ready(function(){
      getProducts()
});

function getProducts()
{
  $.ajax({
        url: "/products/products.json",
        datatype:"json",
        type:"GET",
        headers:{"Access-Control-Allow-Origin": "*"}
    }).done(function(results) {

        create_products_section(results.products)
    });
}
/* list of products */
function create_products_section(data) {
    
    var $section = $("<section />",{class:"container-fluid"});
    var $title = $("<h2/>",{text: "Products", align:"center"});
    var $row = $("<div />", { class: "row" });
    

    var products = data.map(function (product, index) {
        var $container = $("<div/>",{class:"col-sm-4"});
        var $img = $("<img />", {   src: product.image.src, 
                                    alt:"Image Not Available", 
                                    width:"100%",
                                    height:"300px"
                                });

        var $product_title = $("<div/>", { text: product.title });
        var price_text = "$" + product.variants[0].price;
        var $price_container = $("<div/>",{text: price_text});
        var parameter = product.title + "','" + product.variants[0].price;

        var $buy_button = $("<button />",{
                                            class: "btn btn-primary btn-block", 
                                            text:"Buy",
                                            onClick: "create_order('" + parameter +"')"
                                        })
        $container.append([$img, $product_title, $price_container, $buy_button]);
        return $container;
    });
    $section.append([$title, $row])
    $section.append(products)
    $("body").append($section)
}

function create_order(title, price)
{
    console.log(title)
    console.log(price)

    var draft_order = { "draft_order": {
                        "line_items": [
                            {
                                "title": title,
                                "price": price,
                                "quantity": 1
                            }
                        ]
                    }
                }

    console.log("sending",draft_order)
    $.ajax({
        url: "/products/draft_order",
        datatype:"json",
        type:"post",
        data: {data:JSON.stringify(draft_order)},
        headers:{"Access-Control-Allow-Origin": "*"}
    }).done(function(results) {

        console.log("received",results)
    });
}
