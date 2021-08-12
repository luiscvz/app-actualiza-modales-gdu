var skuIds = [];
var promiseSkuIds = [];

var infoSkus = [];
var promiseInfoSkus = [];


var finalPage = 2; //tope maximo en 41

var request = require('request');

//PASO 1: listar los skus en destino
for (a = 0; a <= finalPage; a++) {
    if (a == 1){
        console.log('comenzando proceso...');
    } 
    var page = a;
    promiseSkuIds.push(getSkus(page));  
}

//PASO 2: buscar los modales en origen
Promise.all(promiseSkuIds)    
 .then(function(){ 
     console.log(skuIds.length + ' y el data es ' ); 
     //TODO  Nahuel: de aca en adelante, meter timeout donde corresponda
     skuIds.forEach(element => promiseInfoSkus.push(getDataSku(element)));
    })
 .catch(function(err){ console.log(err) });


//PASO 3: consultar los datos en destino, guardarlos para luego actualizar solo el modal con el modal mas nuevo en origen
Promise.all(promiseInfoSkus)    
 .then(function(){ 
     console.log(' terminé de traer modales, son: ' + infoSkus); 
     //guardar la data del sku
    })
 .catch(function(err){ console.log(err) });

//PASO 4: aplicar los modales en destino
//tomar la data de sku guardada, aplicarle el modal almacenado en infoSkus al destino




/**funcionalidades */
function getSkus(pageNow){
    return new Promise (function(resolve, reject){
        var url = 'https://devotouy.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitids?page=' + pageNow + '&pagesize=1000';
        var options = {
            'method': 'GET',
            'url': url,
            'headers': {
                'X-VTEX-API-AppKey': 'vtexappkey-devotouy-FJACCQ',
                'X-VTEX-API-AppToken': 'OGFLSKKVIBXNCKPRMEURDZAAARKNXTLPMMWBNSHDAAEZQOKLUDTACFOPFELBAWYOQIAPONEUWRRDVBJLHZTTAKMHXGWIHGCDBPJINUWGZYELNLTEUZTBDEOFVTSHRVNP'
            }
            };

        //console.log('url option es ' + url);
        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
                reject();
            } else {
                var arrReceived = response.body;
                arrReceived = JSON.parse(arrReceived);
                arrReceived.forEach(function(element){
                    skuIds.push(element);
                });
                resolve();
            }    
        });
    });
    
}

//TODO iterar con timeouts, manteniendo el promificado
function getDataSku(skuId){
    return new Promise (function(resolve, reject){
        var url = 'https://devotoweb.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuId;
        var options = {
            'method': 'GET',
            'url': url,
            'headers': {
                'X-VTEX-API-AppKey': 'vtexappkey-geant-KIPPGY',
                'X-VTEX-API-AppToken': 'GUYLMAMXMBKCFRDHIYMUPSJCGYBEMFKPGLEFGVCPWBDKQCECGBIYTQCOKVEOZIKGRVVTNYBNVWYNPYLDTZYKXLVPJPUKQOQNQWTVGKOHAUDXSOYMJBUAJAJGZGKXDQXG'
            }
            };

        //console.log('url option es ' + url);
        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
                reject();
            } else {
                var dataReceived = response.body
                dataReceived = JSON.parse(dataReceived);
                var modal = dataReceived.ModalType;
                infoSkus.push([skuId, modal]);
                resolve();
            }    
        });
    });
}



/////trash

/*setTimeout(function(){
        
        for (e = 0; e < 15; e++) {
            getDataSku(skuIds[e]);
        }
        
}, 25000);

setTimeout(function(){
    console.log(infoSkus);
}, 70000);*/
