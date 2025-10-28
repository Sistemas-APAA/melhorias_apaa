/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(ui) {
    function onRequest(context) {
        var form = ui.createForm({ title: 'Aviso' });

        form.addField({
            id: 'custpage_msg',
            type: ui.FieldType.INLINEHTML,
            label: 'Mensagem'
        }).defaultValue = '<div style="font-size: 16px; margin: 20px 0;">Fatura salva com sucesso.</div>';

        form.addButton({
            id: 'custpage_ok_button',
            label: 'OK',
            functionName: 'closeWindow'
        });

        form.clientScriptModulePath = './CS_CloseWindow.js';

        context.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});
