/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/search'], (currentRecord, search) => {

    function fieldChanged(context) {
        if (context.sublistId !== 'line' || context.fieldId !== 'custcol_item_almoxarifado') return;

        try {
            const rec = currentRecord.get();
            const line = rec.getCurrentSublistIndex({ sublistId: 'line' });

            // Obtém o ID do item selecionado
            const itemId = rec.getCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'custcol_item_almoxarifado'
            });

            if (!itemId) return;

            const itemLookup = search.lookupFields({
                type: search.Type.ITEM,
                id: itemId,
                columns: ['lastpurchaseprice']
            });

            const lastPurchasePrice = parseFloat(itemLookup.lastpurchaseprice) || 0;

            rec.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'custcol_vlproporcional', 
                value: lastPurchasePrice
            });

            const quantidade = parseFloat(rec.getCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'custcol_quantidade_sax'
            })) || 0;

            const total = lastPurchasePrice * quantidade;

            rec.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'amount',
                value: total
            });

        } catch (e) {
            console.error('Erro em fieldChanged (custcol_item_almoxarifado):', e.message);
        }
    }

    return {
        fieldChanged
    };
});
