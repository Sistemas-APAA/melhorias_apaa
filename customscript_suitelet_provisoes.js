/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search'], function(ui, search) {
    function onRequest(context) {
        var request = context.request;
        var response = context.response;

        var poId = request.parameters.poId;

        var form = ui.createForm({ title: 'Provisões relacionadas ao Pedido de Compra' });

        var sublist = form.addSublist({
            id: 'custpage_provision_list',
            type: ui.SublistType.LIST,
            label: 'Transações de Provisão'
        });

        sublist.addField({ id: 'prov_id', type: ui.FieldType.TEXT, label: 'ID Provisão' });
        sublist.addField({ id: 'prov_data', type: ui.FieldType.DATE, label: 'Data' });
        sublist.addField({ id: 'prov_valor', type: ui.FieldType.CURRENCY, label: 'Valor' });

        // Substitua esta busca pela lógica real da sua provisão
        var provSearch = search.create({
            type: 'customtransaction_provisao', // ou o tipo correto
            filters: [['custbody_pedido_compra', 'is', poId]],
            columns: ['internalid', 'trandate', 'amount']
        });

        var i = 0;
        provSearch.run().each(function(result) {
            sublist.setSublistValue({ id: 'prov_id', line: i, value: result.getValue('internalid') });
            sublist.setSublistValue({ id: 'prov_data', line: i, value: result.getValue('trandate') });
            sublist.setSublistValue({ id: 'prov_valor', line: i, value: result.getValue('amount') });
            i++;
            return true;
        });

        response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});
