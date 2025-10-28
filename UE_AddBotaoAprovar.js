/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/ui/serverWidget'], function (serverWidget) {

    function beforeLoad(context) {
        if (context.type !== context.UserEventType.VIEW) return;

        var rec = context.newRecord;
        var form = context.form;

        // Verifica o campo custbody_bit_body_status_cot
        var statusCot = rec.getValue('custbody_bit_body_status_cot');

        // Só adiciona o botão se statusCot == 1
        if (statusCot == 1) {
            form.clientScriptModulePath = 'SuiteScripts/CS_AprovarCotacao.js';
            form.addButton({
                id: 'custpage_btn_aprovar',
                label: 'Aprovar',
                functionName: 'aprovarCotacao'
            });
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});
