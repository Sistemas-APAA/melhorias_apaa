/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/log'], function (record, search, log) {

    function execute(context) {
        try {
            // ID do Blanket Purchase Order (BPO)
       //    var record = currentRecord.get();
       //     var bpoId = record.id;   // Substitua pelo ID do seu Blanket PO
              var bpoId = 281681;
          
            // 1. Buscar POs vinculados ao BPO
            var poSearch = search.create({
                type: search.Type.PURCHASE_ORDER,
                filters: [
                    ['createdfrom', 'anyof', bpoId]  // Filtro para pegar POs gerados a partir do BPO
                ],
                columns: ['internalid', 'tranid']  // Campos retornados
            });

            var bpoSearch = search.create({
                type: search.Type.BLANKET_PURCHASE_ORDER,  // Substitua pelo tipo correto
                filters: [['internalid', 'is', bpoId]],
                columns: ['custbody20']
            });

            var searchResult = bpoSearch.run().getRange({ start: 0, end: 1 });

            if (searchResult.length > 0) {
                var purchaseContract = searchResult[0].getValue('custbody20');

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

                // 3. Alterar uma informação no PO (exemplo: adicionar memo)
                poRecord.setValue({
                    fieldId: 'memo',
                    value: 'Atualizado via script'
                });

                poRecord.setValue({
                    fieldId: 'purchasecontract',
                    value: purchaseContract
                });
                poRecord.setValue({
                    fieldId: 'purchasecontract',
                    value: purchaseContract
                });
                poRecord.setValue({
                    fieldId: 'item.pricefromcontract',
                    value: "T"
                });
                // 4. Salvar o PO modificado
                poRecord.setValue({
                    fieldId: 'item.ratedetailurl',
                    value: "/app/accounting/transactions/purchasecontract/purchaseratedetail.nl?id=429"
                });
                // 4. Salvar o PO modificado
                var savedPoId = poRecord.save();
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