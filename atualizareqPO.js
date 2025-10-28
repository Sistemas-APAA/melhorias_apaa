/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/log'], function (record, search, log) {

    function execute(context) {
        try {
            // ID do Blanket Purchase Order (BPO)
       //    var record = currentRecord.get();
       //     var requisitionid = record.id;   // Substitua pelo ID do seu Blanket PO
              var requisitionid = 276414;
              var poid = 278309
	      
            // 1. Buscar POs vinculados ao BPO
            var poSearch = search.create({
                type: search.Type.PURCHASE_ORDER,
                filters: [
                    ['internalid', 'anyof', poid],  // Filtro para pegar POs gerados a partir do BPO
		    ['item.line', 'anyof', "5",'linkedorder_display']
                ],
                columns: ['linked', 'tranid','linkedorder','linkedorder_labels']  // Campos retornados
            });

            var poSearch = search.create({
                type: search.Type.PURCHASE_REQUISITION,
                filters: [
                    ['internalid', 'anyof', requisitionid],  // Filtro para pegar POs gerados a partir do BPO
		    ['item.line', 'anyof', "5",'linkedorder_display']
                ],
                columns: ['linked', 'tranid','linkedorder','linkedorder_labels','pricefromcontract']  // Campos retornados
            });

            var searchResult = bpoSearch.run().getRange({ start: 0, end: 1 });

            if (searchResult.length > 0) {
                var purchaseRequisition = searchResult[0].getValue('custbody20');

            var searchResult = poSearch.run().getRange({ start: 0, end: 1000 });  // Limite de 100 resultados

            // 2. Iterar sobre os POs encontrados e atualizar informações
            searchResult.forEach(function (result) {
                var poId = result.getValue('internalid');
                log.debug('PO encontrado', 'ID: ' + poId);

                // Carregar o PO para edição
                var poRecord = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: poId,
                    isDynamic: true
                });

                var reqRecord = record.load({
                    type: record.Type.PURCHASE_REQUISITION,
                    id: poId,
                    isDynamic: true
                });


                poRecord.setValue({
                    fieldId: 'item.linked',
                    value: true
                });
                poRecord.setValue({
                    fieldId: 'item.linkedorder',
                    value: requisitionid
                });
                poRecord.setValue({
                    fieldId: 'item.linkedorder_display',
                    value: "PO3495"
                });
                poRecord.setValue({
                    fieldId: 'item.linkedorder_labels',
                    value: "PO3495"
                });

                var savedPoId = poRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

                reqRecord.setValue({
                    fieldId: 'item.linked',
                    value: true
                });
                reqRecord.setValue({
                    fieldId: 'item.linkedorder',
                    value: poId
                });
                reqRecord.setValue({
                    fieldId: 'item.linkedorder_display',
                    value: "2681"
                });
                reqRecord.setValue({
                    fieldId: 'item.linkedorder_labels',
                    value: "2681"
                });

                var savedReqId = reqRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });


                log.debug('PO Atualizado', 'ID: ' + savedPoId);
            });
        }
        } catch (e) {
            log.error('Erro ao atualizar POs', e.toString());
        }
    }

    return {
        execute: execute
    };
});