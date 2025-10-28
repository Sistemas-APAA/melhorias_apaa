/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function (serverWidget) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = serverWidget.createForm({ title: 'Aviso' });

            var htmlField = form.addField({
                id: 'custpage_msg',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Mensagem'
            });

            htmlField.defaultValue = 
                '<div style="text-align:center; font-size:16px; margin-top:20px;">' +
                '<p>Fatura salva com sucesso.</p>' +
                '<button onclick="window.close()">OK</button>' +
                '</div>';

            context.response.writePage(form);
        }
    }

    return {
        onRequest: onRequest
    };
});
