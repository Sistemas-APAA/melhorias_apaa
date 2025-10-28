/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/ui/serverWidget'], (serverWidget) => {
    function beforeLoad(context) {
        if (context.type !== context.UserEventType.VIEW) return;

        var form = context.form;
        form.clientScriptModulePath = './popup_client.js'; // Caminho do Client Script
    }

    return { beforeLoad };
});
