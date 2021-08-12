var skuIds;
var promiseSkuIds;

var infoSkus;
var promiseInfoSkus;

var dataSkus;
var promiseDataSkus;

var promisePuts = [];

var infoFinal = [];

//Modifitar siguiente variable para que utilice el maximo de las paginas
var startPage = 43;
var endPage = 45; //tope maximo en 41 si son 1000 x pagina
var stepPage = 2;
var maxPage = 204;

var request = require('request');


//PASO 1: listar los skus en destino
emptyArrs();
iniciaProceso();

function emptyArrs(){
   skuIds = [];
   promiseSkuIds = [];

   infoSkus = [];
   promiseInfoSkus = [];

   dataSkus = [];
   promiseDataSkus = [];
}

function iniciaProceso(){
   
   for (a = startPage; a <= endPage; a++) {
      if (a == startPage){
          console.log('comenzando proceso...');
      } 
      var page = a;
      promiseSkuIds.push(getSkus(page));  
  }
};

//PASO 2: buscar los modales en origen
Promise.all(promiseSkuIds)    
 .then(function(){ 
     console.log(skuIds.length + ' y el data es ' ); 
     //TODO  Nahuel: de aca en adelante, meter timeout donde corresponda
    for (var i = 0; i < skuIds.length; i++) {
       promiseInfoSkus.push(getDataSku(skuIds[i], i));
    }
    })
 .catch(function(err){ console.log(err) });




/**funcionalidades */
function getSkus(pageNow){
   return new Promise(function (resolve, reject) {
        var url = 'https://devotouy.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitids?page=' + pageNow + '&pagesize=200';
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
function getDataSku(skuId, index) {
   setTimeout(function () {
      return new Promise(function (resolve, reject) {
         console.log("haciendo getDataSku: " + index + " vez/veces");
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
               //console.log([skuId, modal]);
               infoSkus.push([skuId, modal]);
               if (index == (skuIds.length - 1)) {
                  resolve();
                  console.log("terminado de pushear a infoSkus, sigue recorreDataSku");
                  //console.log(infoSkus);
                  recorreDataSku();
               }
            }
         });
      });
   }, 1500 * index);
}

function getDataSkusDestino(skuId, index) {
   setTimeout(function () {
      return new Promise(function (resolve, reject) {
         console.log("haciendo getDataSkusDestino: " + index + " vez/veces");
         var url = 'https://devotouy.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/' + skuId;
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
               var dataReceived = response.body
               dataReceived = JSON.parse(dataReceived);
               var datosParaPush = {
                  Id: dataReceived.Id,
                  ProductId: dataReceived.ProductId,
                  IsActive: dataReceived.IsActive,
                  Name: dataReceived.Name,
                  PackagedHeight: dataReceived.PackagedHeight,
                  PackagedLength: dataReceived.PackagedLength,
                  PackagedWidth: dataReceived.PackagedWidth,
                  PackagedWeightKg: dataReceived.PackagedWeightKg,
                  Height: dataReceived.Height,
                  Length: dataReceived.Length,
                  Width: dataReceived.Width,
                  WeightKg: dataReceived.WeightKg,
                  CubicWeight: dataReceived.CubicWeight,
                  IsKit: dataReceived.IsKit,
                  RewardValue: dataReceived.RewardValue,
                  CommercialConditionId: dataReceived.CommercialConditionId,
                  UnitMultiplier: dataReceived.UnitMultiplier,
                  KitItensSellApart: dataReceived.KitItensSellApart,
                  ActivateIfPossible: dataReceived.ActivateIfPossible,
                  ModalType: dataReceived.ModalType
               }
               //console.log([skuId, datosParaPush]);
               dataSkus.push([skuId, datosParaPush]);
               if (index == (skuIds.length - 1)) {
                  resolve();
                  console.log("terminado de pushear a dataSkus sigue compararValoresyReemplaza");
                  compararValoresyReemplaza();
               }
               
            }
         });
      });
   }, 1500 * index);
}

function putModalType(skuId, dataSku, dataModalTypeNew, index) {  
   setTimeout(function () {
      return new Promise (function (resolve, reject) {
      var jsonParaReemplazar = dataSku[1];
      console.log(jsonParaReemplazar.Name);
      
         var url = 'https://devotouy.myvtex.com/api/catalog/pvt/stockkeepingunit/' + skuId;
         var options = {
            'method': 'PUT',
            'url': url,
            'headers': {
               'X-VTEX-API-AppKey': 'vtexappkey-devotouy-FJACCQ',
               'x-vtex-api-appToken': 'OGFLSKKVIBXNCKPRMEURDZAAARKNXTLPMMWBNSHDAAEZQOKLUDTACFOPFELBAWYOQIAPONEUWRRDVBJLHZTTAKMHXGWIHGCDBPJINUWGZYELNLTEUZTBDEOFVTSHRVNP',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               Id: jsonParaReemplazar.Id,
               ProductId: jsonParaReemplazar.ProductId,
               IsActive: jsonParaReemplazar.IsActive,
               Name: jsonParaReemplazar.Name,
               PackagedHeight: jsonParaReemplazar.PackagedHeight,
               PackagedLength: jsonParaReemplazar.PackagedLength,
               PackagedWidth: jsonParaReemplazar.PackagedWidth,
               PackagedWeightKg: jsonParaReemplazar.PackagedWeightKg,
               Height: jsonParaReemplazar.Height,
               Length: jsonParaReemplazar.Length,
               Width: jsonParaReemplazar.Width,
               WeightKg: jsonParaReemplazar.WeightKg,
               CubicWeight: jsonParaReemplazar.CubicWeight,
               IsKit: jsonParaReemplazar.IsKit,
               RewardValue: jsonParaReemplazar.RewardValue,
               CommercialConditionId: jsonParaReemplazar.CommercialConditionId,
               UnitMultiplier: jsonParaReemplazar.UnitMultiplier,
               KitItensSellApart: jsonParaReemplazar.KitItensSellApart,
               ActivateIfPossible: jsonParaReemplazar.ActivateIfPossible,
               ModalType: dataModalTypeNew
            })

         };
         request(options, function (error, response) {
            if (error) {
               //throw new Error(error);
               console.log('hubo un error al intentar putModalType en el index ' + index + ' de la startPage ' + startPage + ' y es ' + error);
            } else {
               console.log("putModalType ok para el index " + index);
            }
            if (index == (dataSkus.length - 1)) {
               //resolve();

               //PASO 5: terminado todo el lote, rearrancar con el siguiente
               if (endPage < (maxPage - stepPage)) {
                  startPage += stepPage;
                  endPage += stepPage;
                  
                  emptyArrs();
                  setTimeout(function(){
                     iniciaProceso();
                     console.log('si ves esto al final, festeja, arranca nuevo lote en pagina ' + startPage + ' hasta ' + endPage);
                  }, 1000);
               }

            }
            
         });
      });
   }, 1500 * index);
   
}


//PASO 3: consultar los datos en destino, guardarlos para luego actualizar solo el modal con el modal mas nuevo en origen
function recorreDataSku() {
   for (var i = 0; i < skuIds.length; i++) {
      promiseDataSkus.push(getDataSkusDestino(skuIds[i], i));
   }
}

//PASO 4: Reemplaza ModalTypes

function compararValoresyReemplaza() {
   for(var i=0; i < infoSkus.length; i++) {
      for(var j=0 ;j < dataSkus.length; j++) {
         if (infoSkus[i][0] == dataSkus[j][0]) {
            infoFinal.push([dataSkus[j], infoSkus[i][1]]);
            //console.log('el arr infoFinal es ' + infoFinal);
            putModalType(infoSkus[i][0], dataSkus[j], infoSkus[i][1], i);
         }
      }
   }
}




/*Promise.all(promisePuts)    
 .then(function(){ 
   console.log("termine de actualizar en destino, DEBIERA REARRANCAR");
    })
 .catch(function(err){ console.log(err) });*/



// function filtrarModalType() {
//    for (var i = 0; i < infoSkus.length; i++) {
//       var dato = dataSkus.filter(skuIds[i] => )
//    }
// }


// /////trash

// /*setTimeout(function(){
        
//         for (e = 0; e < 15; e++) {
//             getDataSku(skuIds[e]);
//         }
        
// }, 25000);

// setTimeout(function(){
//     console.log(infoSkus);
// }, 70000);*/
